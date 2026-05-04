import CardList from "@/components/ui/cardList";

import { useGlobalStyles } from "@/constants/globalStyles";
import { useIsFocused } from "@react-navigation/native";
import { Heart } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { FlatList, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLists } from "../context/ListsContext";
import { useSettings } from "../context/SettingsContext";
import { closeAllSwipes, SwipeableRef } from "../utils/functionsSwipe";
export default function Favorites() {
  const { colors } = useSettings();
  const { listas, setListas, carregarListas } = useLists();
  const globalStyles = useGlobalStyles();
  const isFocused = useIsFocused();
  const openSwipeRef = useRef<SwipeableRef | null>(null);
  const insets = useSafeAreaInsets();
  const carregouRef = useRef(false);
  useEffect(() => {
    if (isFocused && !carregouRef.current) {
      carregarListas();
      carregouRef.current = true;
    }
  }, [isFocused]);
  const listasFavoritas = listas.filter((l) => l.favorited);
  return (
    <View
      style={[
        globalStyles.safe,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
      onStartShouldSetResponderCapture={() => {
        closeAllSwipes(openSwipeRef);
        return false;
      }}
    >
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Favoritos</Text>
        <Text style={globalStyles.subtitle}>Suas listas favoritas</Text>
        <View
          style={{
            height: 1,
            backgroundColor: colors.border,
            marginTop: 12,
            marginHorizontal: -20,
          }}
        />
        {listasFavoritas.length === 0 ? (
          <View style={globalStyles.emptyContainer}>
            <View style={globalStyles.iconCircle}>
              <Heart size={32} color="#424242" />
            </View>

            <Text style={globalStyles.emptyTitle}>Sem favoritos</Text>
            <Text style={globalStyles.emptyText}>
              Favorite suas listas para acessá-las rapidamente aqui.
            </Text>
          </View>
        ) : (
          <View
            style={{ marginTop: 20, flex: 1, overflow: "hidden" }}
            key={isFocused ? "focused" : "unfocused"}
          >
            <FlatList
              data={listasFavoritas}
              showsVerticalScrollIndicator={false}
              removeClippedSubviews={false}
              windowSize={5}
              initialNumToRender={10}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => (
                <CardList
                  key={item.id}
                  lista={item}
                  setListas={setListas}
                  openSwipeRef={openSwipeRef}
                  index={index}
                  flag="favorites"
                  typeCopy="favorites"
                />
              )}
              style={{ flex: 1 }}
            />
          </View>
        )}
      </View>
    </View>
  );
}
