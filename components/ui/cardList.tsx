import { useSettings } from "@/app/context/SettingsContext";
import { deleteList } from "@/app/database/listsRepository";
import { TypeListRenderHome } from "@/app/types/typesGlobal";
import { FavoritedList } from "@/app/utils/functionFavorited";
import { SwipeableRef } from "@/app/utils/functionsSwipe";
import { useGlobalStyles } from "@/constants/globalStyles";
import { router } from "expo-router";
import { Copy, Star } from "lucide-react-native";
import { RefObject, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, {
  FadeInDown,
  LinearTransition,
  SharedValue,
} from "react-native-reanimated";
import { RightAction } from "./RightAction";

interface PropsCardList {
  lista: TypeListRenderHome;
  setListas: React.Dispatch<React.SetStateAction<TypeListRenderHome[]>>;
  openSwipeRef: RefObject<SwipeableRef | null>;
  index: number;
  flag?: string;
}

export default function CardList({
  lista,
  setListas,
  openSwipeRef,
  index,
  flag,
}: PropsCardList) {
  const { animationsEnabled, colors } = useSettings();
  const globalStyles = useGlobalStyles();
  const swipeableRef = useRef<SwipeableRef | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  const total = lista.itens.length;
  const concluidos = lista.itens.filter((item) => item.checked).length;
  const porcentagem = total === 0 ? 0 : Math.round((concluidos / total) * 100);

  function onRemover() {
    deleteList(lista.id);
    setListas((prev) => prev.filter((l) => l.id !== lista.id));
  }
  return (
    <Animated.View
      entering={
        animationsEnabled
          ? FadeInDown.delay(index * 100)
              .duration(600)
              .springify()
          : undefined
      }
      layout={LinearTransition}
    >
      <ReanimatedSwipeable
        ref={swipeableRef}
        onSwipeableOpen={() => {
          if (
            openSwipeRef.current &&
            openSwipeRef.current !== swipeableRef.current
          ) {
            openSwipeRef.current.close();
          }
          openSwipeRef.current = swipeableRef.current;
        }}
        renderRightActions={(
          prog: SharedValue<number>,
          drag: SharedValue<number>
        ) => <RightAction prog={prog} drag={drag} onRemover={onRemover} />}
        onSwipeableWillOpen={() => setIsSwiping(true)}
        onSwipeableClose={() => setIsSwiping(false)}
        onSwipeableWillClose={() => setIsSwiping(false)}
        friction={1}
        overshootRight={false}
        rightThreshold={30}
      >
        <Pressable
          disabled={isSwiping}
          onPress={() =>
            router.push({
              pathname: "/components/lista-aberta",
              params: { id: lista.id },
            })
          }
          style={[
            globalStyles.card,
            {
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.card,
            },
          ]}
        >
          <View style={globalStyles.cardHeader}>
            <Text style={[globalStyles.cardTitle, { color: colors.text }]}>
              {lista.name}
            </Text>

            <View style={globalStyles.iconContainer}>
              <Pressable
                style={({ pressed }) => [
                  globalStyles.iconButton,
                  pressed && { transform: [{ scale: 0.9 }] },
                ]}
              >
                {({ pressed }) => (
                  <Copy
                    size={18}
                    color={pressed ? colors.primary : colors.iconColor}
                  />
                )}
              </Pressable>

              <Pressable
                onPress={() => FavoritedList(lista, setListas, flag)}
                style={({ pressed }) => [
                  globalStyles.iconButton,
                  pressed && { transform: [{ scale: 0.9 }] },
                ]}
              >
                {({ pressed }) => {
                  const isActive = lista.favorited || pressed;

                  return (
                    <Star
                      size={18}
                      color={isActive ? "#FFD700" : colors.iconColor}
                      fill={isActive ? "#FFD700" : "transparent"}
                    />
                  );
                }}
              </Pressable>
            </View>
          </View>

          <View style={globalStyles.progressRow}>
            <View
              style={[
                globalStyles.progressContainer,
                {
                  backgroundColor: colors.border,
                },
              ]}
            >
              <View
                style={[
                  globalStyles.progressBar,
                  {
                    backgroundColor: colors.primary,
                    width: `${porcentagem}%`,
                  },
                ]}
              />
            </View>

            <Text
              style={[globalStyles.progressText, { color: colors.subtext }]}
            >
              {porcentagem}%
            </Text>
          </View>

          <Text style={[globalStyles.itemsText, { color: colors.subtext }]}>
            {concluidos}/{total} itens concluídos
          </Text>
        </Pressable>
      </ReanimatedSwipeable>
    </Animated.View>
  );
}
