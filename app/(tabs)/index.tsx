import CardList from "@/components/ui/cardList";

import { useGlobalStyles } from "@/constants/globalStyles";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Plus, ShoppingCart } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useSettings } from "../context/SettingsContext";
import { getLists } from "../database/listsRepository";
import { TypeListRenderHome } from "../types/typesGlobal";
import { closeAllSwipes, SwipeableRef } from "../utils/functionsSwipe";
export default function Home() {
  const insets = useSafeAreaInsets();
  const { colors } = useSettings();
  const globalStyles = useGlobalStyles();
  const isFocused = useIsFocused();
  const router = useRouter();
  const [listas, setListas] = useState<TypeListRenderHome[]>([]);
  const openSwipeRef = useRef<SwipeableRef | null>(null);

  useEffect(() => {
    if (isFocused) {
      const listasDb = getLists();
      setListas(listasDb);
    }
  }, [isFocused]);

  return (
    <SafeAreaView
      style={[globalStyles.safe, { backgroundColor: colors.background }]}
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
          <View
            style={{ marginTop: 20, flex: 1, overflow: "hidden" }}
            key={isFocused ? "focused" : "unfocused"}
          >
            <ScrollView>
              {listas.map((lista, index) => (
                <CardList
                  key={lista.id}
                  lista={lista}
                  setListas={setListas}
                  openSwipeRef={openSwipeRef}
                  index={index}
                />
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      <Pressable
        onPress={() => router.push("/components/criar-lista")}
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
    </SafeAreaView>
  );
}
