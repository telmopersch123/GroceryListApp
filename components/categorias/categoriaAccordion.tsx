import { useSettings } from "@/app/context/SettingsContext";
import { Categoria, TypeListRenderHome } from "@/app/types/typesGlobal";
import { closeAllSwipes, SwipeableRef } from "@/app/utils/functionsSwipe";
import {
  Apple,
  Beef,
  Bike,
  Bone,
  ChevronRight,
  Cookie,
  Flame,
  Gift,
  Heart,
  Home,
  Leaf,
  Milk,
  Pencil,
  Shirt,
  ShoppingCart,
  Smile,
  Snowflake,
  Sparkles,
  Wine,
} from "lucide-react-native";
import { RefObject, useMemo, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { SharedValue } from "react-native-reanimated";
import CardList from "../ui/cardList";
import { RightAction } from "../ui/RightAction";

export const ICONES = [
  ShoppingCart,
  Apple,
  Beef,
  Cookie,
  Milk,
  Wine,
  Sparkles,
  Heart,
  Smile,
  Bone,
  Pencil,
  Bike,
  Shirt,
  Home,
  Leaf,
  Flame,
  Snowflake,
  Gift,
];

export function CategoriaAccordion({
  categoria,
  listas,
  setListas,
  openSwipeRef,
  handleRemove,
}: {
  categoria: Categoria;
  listas: TypeListRenderHome[];
  setListas: React.Dispatch<React.SetStateAction<TypeListRenderHome[]>>;
  openSwipeRef: RefObject<SwipeableRef | null>;
  handleRemove: (id: number | null) => void;
}) {
  const { colors, animationsEnabled } = useSettings();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [isOpen, setIsOpen] = useState(false);
  const isSwiping = useRef(false);

  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const animOpen = useRef(new Animated.Value(0)).current;
  const animRotate = useRef(new Animated.Value(0)).current;
  const measured = useRef(false);

  const swipeableRef = useRef<SwipeableRef | null>(null);

  function toggle() {
    closeAllSwipes(openSwipeRef);
    if (isSwiping.current) return;

    const next = !isOpen;
    setIsOpen(next);

    if (!animationsEnabled) {
      animOpen.setValue(next ? 1 : 0);
      animRotate.setValue(next ? 1 : 0);
      return;
    }

    Animated.parallel([
      Animated.timing(animOpen, {
        toValue: next ? 1 : 0,
        duration: 220,
        useNativeDriver: false,
      }),
      Animated.timing(animRotate, {
        toValue: next ? 1 : 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }
  const handleLayout = (e: any) => {
    if (measured.current) return;
    const h = e.nativeEvent.layout.height;
    if (h > 0) {
      measured.current = true;
      setContentHeight(h);
    }
  };
  const rotate = animRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  const Icone = ICONES[categoria.icon];

  const renderContent = () =>
    listas.length > 0 ? (
      listas.map((lista, index) => (
        <CardList
          key={lista.id}
          lista={lista}
          setListas={setListas}
          openSwipeRef={openSwipeRef}
          index={index}
        />
      ))
    ) : (
      <Text style={styles.emptyListas}>Nenhuma lista nesta categoria.</Text>
    );

  return (
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
      onSwipeableOpenStartDrag={() => {
        isSwiping.current = true;
      }}
      onSwipeableClose={() => {
        isSwiping.current = false;
      }}
      onSwipeableWillClose={() => {
        isSwiping.current = false;
      }}
      renderRightActions={(
        prog: SharedValue<number>,
        drag: SharedValue<number>
      ) => (
        <RightAction
          prog={prog}
          drag={drag}
          onRemover={handleRemove}
          categoriaId={categoria.id}
        />
      )}
      overshootRight={false}
      friction={1}
    >
      <View style={[styles.categoriaCard, { paddingBottom: isOpen ? 4 : 14 }]}>
        <Pressable
          disabled={isSwiping.current}
          style={styles.categoriaRow}
          onPress={toggle}
        >
          <View style={styles.categoriaLeft}>
            <View style={styles.categoriaIcone}>
              <Icone size={22} color={colors.primary} />
            </View>

            <Text style={styles.categoriaText}>{categoria.nome}</Text>
          </View>

          <View style={styles.categoriaRight}>
            <Text style={styles.categoriaListas}>
              {listas.length} {listas.length === 1 ? "lista" : "listas"}
            </Text>

            <Animated.View style={{ transform: [{ rotate }] }}>
              <ChevronRight size={18} color={colors.subtext} />
            </Animated.View>
          </View>
        </Pressable>

        {animationsEnabled ? (
          <Animated.View
            style={{
              height: contentHeight
                ? animOpen.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, contentHeight],
                  })
                : undefined,
              opacity: animOpen,
              overflow: "hidden",
            }}
          >
            <View style={styles.accordionContent} onLayout={handleLayout}>
              {listas.length > 0 ? (
                listas.map((lista, index) => (
                  <CardList
                    key={lista.id}
                    lista={lista}
                    setListas={setListas}
                    openSwipeRef={openSwipeRef}
                    index={index}
                  />
                ))
              ) : (
                <Text style={styles.emptyListas}>
                  Nenhuma lista nesta categoria.
                </Text>
              )}
            </View>
          </Animated.View>
        ) : isOpen ? (
          <View style={[styles.accordionContent, { overflow: "hidden" }]}>
            {listas.length > 0 ? (
              listas.map((lista, index) => (
                <CardList
                  key={lista.id}
                  lista={lista}
                  setListas={setListas}
                  openSwipeRef={openSwipeRef}
                  index={index}
                  flag="category"
                />
              ))
            ) : (
              <Text style={styles.emptyListas}>
                Nenhuma lista nesta categoria.
              </Text>
            )}
          </View>
        ) : null}
      </View>
    </ReanimatedSwipeable>
  );
}

const makeStyles = (colors: any) =>
  StyleSheet.create({
    accordionContent: {
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      marginTop: 10,
    },

    emptyListas: {
      fontSize: 13,
      color: colors.subtext,
      textAlign: "center",
      paddingVertical: 8,
    },

    categoriaCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 14,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },

    categoriaRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    categoriaLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },

    categoriaIcone: {
      width: 42,
      height: 42,
      borderRadius: 10,
      backgroundColor: colors.inputBg,
      justifyContent: "center",
      alignItems: "center",
    },

    categoriaText: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
    },

    categoriaRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },

    categoriaListas: {
      fontSize: 13,
      color: colors.subtext,
    },
  });
