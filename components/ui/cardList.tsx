import { useSettings } from "@/app/context/SettingsContext";
import {
  createList,
  deleteList,
  LIMITE_LISTAS,
} from "@/app/database/listsRepository";
import { TypeListRenderHome } from "@/app/types/typesGlobal";
import { FavoritedList } from "@/app/utils/functionFavorited";
import { SwipeableRef } from "@/app/utils/functionsSwipe";
import { useGlobalStyles } from "@/constants/globalStyles";
import MaskedView from "@react-native-masked-view/masked-view";
import { useIsFocused } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Copy, Star } from "lucide-react-native";
import { memo, RefObject, useEffect, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";

import Animated, {
  Easing,
  LinearTransition,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { RightAction } from "./RightAction";
import { toastError, toastSuccess } from "./Toast";

interface PropsCardList {
  lista: TypeListRenderHome;
  setListas: React.Dispatch<React.SetStateAction<TypeListRenderHome[]>>;
  openSwipeRef: RefObject<SwipeableRef | null>;
  index: number;
  flag?: string;
  typeCopy?: string;
}

function CardList({
  lista,
  setListas,
  openSwipeRef,
  index,
  flag,
  typeCopy,
}: PropsCardList) {
  const { animationsEnabled, colors } = useSettings();
  const globalStyles = useGlobalStyles();
  const swipeableRef = useRef<SwipeableRef | null>(null);
  const isSwiping = useRef(false);
  const isFocused = useIsFocused();
  const total = lista.itens.length;
  const concluidos = lista.itens.filter((item) => item.checked).length;
  const porcentagem = total === 0 ? 0 : Math.round((concluidos / total) * 100);
  const opacity = useSharedValue(animationsEnabled ? 0 : 1);
  const translateY = useSharedValue(animationsEnabled ? 8 : 0);
  const translateX = useSharedValue(0);
  useEffect(() => {
    if (!animationsEnabled || !isFocused) return;

    opacity.value = 0;
    translateY.value = 14;

    const config = { duration: 320, easing: Easing.out(Easing.cubic) };

    opacity.value = withDelay(index * 40, withTiming(1, config));
    translateY.value = withDelay(index * 40, withTiming(0, config));
  }, [isFocused, animationsEnabled]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
    ],
  }));

  function onRemover() {
    if (animationsEnabled) {
      translateX.value = withTiming(-400, {
        duration: 280,
        easing: Easing.in(Easing.cubic),
      });
      opacity.value = withTiming(0, { duration: 250 });

      setTimeout(() => {
        deleteList(lista.id);
        setListas((prev) => prev.filter((l) => l.id !== lista.id));
      }, 260);
    } else {
      deleteList(lista.id);
      setListas((prev) => prev.filter((l) => l.id !== lista.id));
    }
  }

  function CopyList(
    lista: TypeListRenderHome,
    setListas: React.Dispatch<React.SetStateAction<TypeListRenderHome[]>>
  ) {
    try {
      const novaLista = createList(
        lista.name,
        null,
        lista.itens,
        "copy",
        typeCopy
      );
      setListas((prev) => [novaLista, ...prev]);
      toastSuccess("Lista copiada com sucesso!");
    } catch (error: any) {
      if (error.message === "LIMITE_LISTAS") {
        toastError(`Limite de ${LIMITE_LISTAS} listas atingido.`);
      } else {
        toastError("Ocorreu um erro ao criar a lista.");
      }
    }
  }
  return (
    <Animated.View style={animatedStyle} layout={LinearTransition}>
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
        ) => (
          <RightAction
            prog={prog}
            drag={drag}
            onRemover={onRemover}
            categoriaId={lista.category_id ?? null}
          />
        )}
        onSwipeableWillOpen={() => {
          isSwiping.current = true;
        }}
        onSwipeableClose={() => {
          isSwiping.current = false;
        }}
        onSwipeableWillClose={() => {
          isSwiping.current = false;
        }}
        friction={1}
        overshootRight={false}
        rightThreshold={30}
      >
        <Pressable
          disabled={isSwiping.current}
          onPress={() =>
            router.push({
              pathname: "/components/lista-aberta",
              params: {
                id: lista.id,
                from: flag ?? "home",
              },
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
            <MaskedView
              style={{ flex: 1 }}
              maskElement={
                <LinearGradient
                  colors={["black", "black", "transparent"]}
                  locations={[0, 0.7, 1]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ flex: 1, height: "100%" }}
                />
              }
            >
              <Text
                numberOfLines={1}
                style={[globalStyles.cardTitle, { color: colors.text }]}
              >
                {lista.name}
              </Text>
            </MaskedView>

            <View style={globalStyles.iconContainer}>
              {flag !== "category" && (
                <Pressable
                  style={({ pressed }) => [
                    globalStyles.iconButton,
                    pressed && { transform: [{ scale: 0.9 }] },
                  ]}
                  onPress={() => {
                    CopyList(lista, setListas);
                  }}
                >
                  {({ pressed }) => (
                    <Copy
                      size={18}
                      color={pressed ? colors.primary : colors.iconColor}
                    />
                  )}
                </Pressable>
              )}
              <Pressable
                onPress={() => FavoritedList(lista, setListas)}
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
export default memo(CardList, (prev, next) => {
  const itensIguais = prev.lista.itens.every(
    (item, i) => item.checked === next.lista.itens[i]?.checked
  );
  return (
    prev.lista.id === next.lista.id &&
    prev.lista.name === next.lista.name &&
    prev.lista.favorited === next.lista.favorited &&
    prev.lista.itens.length === next.lista.itens.length &&
    prev.lista.category_id === next.lista.category_id &&
    itensIguais
  );
});
