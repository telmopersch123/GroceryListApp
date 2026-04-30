import CardList from "@/components/ui/cardList";

import { useGlobalStyles } from "@/constants/globalStyles";
import { useIsFocused } from "@react-navigation/native";
import { Heart } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSettings } from "../context/SettingsContext";
import { getFavoriteLists } from "../database/listsRepository";
import { TypeListRenderHome } from "../types/typesGlobal";
import { closeAllSwipes, SwipeableRef } from "../utils/functionsSwipe";
export default function Favorites() {
  const { colors } = useSettings();
  const globalStyles = useGlobalStyles();
  const isFocused = useIsFocused();
  const openSwipeRef = useRef<SwipeableRef | null>(null);
  const [listas, setListas] = useState<TypeListRenderHome[]>([]);

  useEffect(() => {
    if (isFocused) {
      const listasDb = getFavoriteLists();
      setListas(listasDb);
    }
  }, [isFocused]);

  return (
    <SafeAreaView
      style={globalStyles.safe}
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
        {listas.length === 0 ? (
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
            <ScrollView>
              {listas.map((lista, index) => (
                <CardList
                  key={lista.id}
                  lista={lista}
                  setListas={setListas}
                  openSwipeRef={openSwipeRef}
                  index={index}
                  flag="favorites"
                />
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
