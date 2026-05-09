import CardList from "@/components/ui/cardList";

import { useGlobalStyles } from "@/constants/globalStyles";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Plus, ShoppingCart } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLists } from "../context/ListsContext";
import { useSettings } from "../context/SettingsContext";
import { closeAllSwipes, SwipeableRef } from "../utils/functionsSwipe";
export default function Home() {
  const { listas, setListas, carregarListas } = useLists();
  const insets = useSafeAreaInsets();
  const { colors } = useSettings();
  const globalStyles = useGlobalStyles();
  const isFocused = useIsFocused();
  const router = useRouter();
  const carregouRef = useRef(false);
  const openSwipeRef = useRef<SwipeableRef | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!isFocused) return;

    if (carregouRef.current) {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    } else {
      carregouRef.current = true;
      carregarListas();
    }
  }, [isFocused]);

  return (
    <View
      style={[
        globalStyles.safe,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
      onStartShouldSetResponderCapture={() => {
        closeAllSwipes(openSwipeRef);
        return false;
      }}
    >
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Lista Mercado</Text>
        <Text style={globalStyles.subtitle}>Suas listas de compras</Text>
        <View
          style={{
            height: 1,
            backgroundColor: colors.border,
            marginTop: 12,
            marginHorizontal: -20,
          }}
        />
        {listas.length === 0 ? (
          <View style={globalStyles.emptyContainer}>
            <View style={globalStyles.iconCircle}>
              <ShoppingCart size={32} color="#424242" />
            </View>

            <Text style={globalStyles.emptyTitle}>Nenhuma lista ainda</Text>
            <Text style={globalStyles.emptyText}>
              Crie sua primeira lista de compras tocando no botão abaixo.
            </Text>
          </View>
        ) : (
          <Animated.View
            entering={FadeIn.duration(200)}
            style={{ marginTop: 20, flex: 1, overflow: "hidden" }}
          >
            <FlatList
              ref={flatListRef}
              data={listas}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              initialNumToRender={8}
              maxToRenderPerBatch={6}
              windowSize={8}
              removeClippedSubviews={false}
              renderItem={({ item, index }) => (
                <CardList
                  lista={item}
                  setListas={setListas}
                  openSwipeRef={openSwipeRef}
                  index={index}
                />
              )}
            />
          </Animated.View>
        )}
      </View>

      <Pressable
        onPress={() => {
          router.push("/components/criar-lista");
        }}
        style={({ pressed }) => [
          globalStyles.floatingButton,
          {
            bottom: insets.bottom + 45,
          },
          pressed && globalStyles.floatingButtonPressed,
        ]}
      >
        <Plus size={32} color="#fff" />
      </Pressable>
    </View>
  );
}
