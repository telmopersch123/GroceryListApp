import { useSettings } from "@/app/context/SettingsContext";
import { Categoria, TypeListRenderHome } from "@/app/types/typesGlobal";
import { closeAllSwipes, SwipeableRef } from "@/app/utils/functionsSwipe";
import { getListsByCategory } from "@/database/listsRepository";
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
import { RefObject, useEffect, useMemo, useRef, useState } from "react";
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
  totalListas,
  setListas,
  openSwipeRef,
  handleRemove,
}: {
  categoria: Categoria;
  totalListas: number;
  setListas: React.Dispatch<React.SetStateAction<TypeListRenderHome[]>>;
  openSwipeRef: RefObject<SwipeableRef | null>;
  handleRemove: (id: number | null) => void;
}) {
  const { colors, animationsEnabled } = useSettings();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [isOpen, setIsOpen] = useState(false);
  const [foiAberto, setFoiAberto] = useState(false);
  const [listasLocais, setListasLocais] = useState<TypeListRenderHome[]>([]);
  const isSwiping = useRef(false);

  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const animOpen = useRef(
    new Animated.Value(animationsEnabled ? 0 : 0)
  ).current;
  const animRotate = useRef(new Animated.Value(0)).current;
  const measured = useRef(false);

  const swipeableRef = useRef<SwipeableRef | null>(null);
  useEffect(() => {
    measured.current = false;
    setContentHeight(null);
  }, [totalListas]);

  function toggle() {
    closeAllSwipes(openSwipeRef);
    if (isSwiping.current) return;
    if (!foiAberto) {
      setFoiAberto(true);
      const listasDb = getListsByCategory(categoria.id);
      setListasLocais(listasDb);
    }
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
              {totalListas} {totalListas === 1 ? "lista" : "listas"}
            </Text>

            <Animated.View style={{ transform: [{ rotate }] }}>
              <ChevronRight size={18} color={colors.subtext} />
            </Animated.View>
          </View>
        </Pressable>

        {(animationsEnabled || isOpen) && (
          <>
            {!contentHeight && foiAberto && (
              <View
                style={{ position: "absolute", opacity: 0, top: -9999 }}
                onLayout={handleLayout}
              >
                <View style={styles.accordionContent}>
                  {listasLocais.length > 0 ? (
                    listasLocais.map((lista, index) => (
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
              </View>
            )}

            <Animated.View
              style={{
                height:
                  animationsEnabled && contentHeight
                    ? animOpen.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, contentHeight],
                      })
                    : isOpen
                    ? undefined
                    : 0,
                opacity: animationsEnabled ? animOpen : 1,
                overflow: "hidden",
              }}
            >
              <View style={styles.accordionContent}>
                {listasLocais.length > 0 ? (
                  listasLocais.map((lista, index) => (
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
            </Animated.View>
          </>
        )}
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
      marginTop: -5,
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
