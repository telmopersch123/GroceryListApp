import { CategoriaAccordion } from "@/components/categorias/categoriaAccordion";
import { CategoryModal } from "@/components/categorias/ModalCategorias";
import { LoadingDots } from "@/components/ui/Loading";
import { toastError, toastSuccess } from "@/components/ui/Toast";
import { useGlobalStyles } from "@/constants/globalStyles";
import { useIsFocused } from "@react-navigation/native";
import { LayoutGrid, Plus } from "lucide-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  createCategory,
  deleteCategory,
  getCategories,
  LIMITE_CATEGORIAS,
} from "../../database/categoriesRepository";
import { useLists } from "../context/ListsContext";
import { useSettings } from "../context/SettingsContext";
import { Categoria } from "../types/typesGlobal";
import { closeAllSwipes, SwipeableRef } from "../utils/functionsSwipe";

function actionsheet({
  setModalVisivel,
  setNomeCategoria,
  setIconeSelecionado,
  setError,
}: {
  setModalVisivel: React.Dispatch<React.SetStateAction<boolean>>;
  setNomeCategoria: React.Dispatch<React.SetStateAction<string>>;
  setIconeSelecionado: React.Dispatch<React.SetStateAction<number>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}) {
  setError("");
  setNomeCategoria("");
  setIconeSelecionado(0);
  setModalVisivel(false);
}

export default function Categorias() {
  const { colors, animationsEnabled } = useSettings();
  const isFocused = useIsFocused();
  const { listas, setListas, carregarListas, listasCarregadas } = useLists();
  const globalStyles = useGlobalStyles();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const openSwipeRef = useRef<SwipeableRef | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [nomeCategoria, setNomeCategoria] = useState("");
  const [iconeSelecionado, setIconeSelecionado] = useState(0);
  const [error, setError] = useState("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const handleCreateCategory = () => {
    if (!nomeCategoria.trim()) {
      const msg = "O nome da categoria é obrigatório.";
      setError(msg);

      return;
    }

    if (categorias.some((c) => c.nome === nomeCategoria)) {
      const msg = "Já existe uma categoria com esse nome.";
      setError(msg);

      return;
    }

    try {
      const result = createCategory(nomeCategoria, iconeSelecionado);

      if (result) {
        setCategorias((prev) => [...prev, result]);
        toastSuccess("Categoria criada com sucesso!");
      } else {
        toastError("Ocorreu um erro ao criar a categoria.");
      }
    } catch (error: any) {
      if (error.message === "LIMITE_CATEGORIAS") {
        toastError(`Você atingiu o limite de ${LIMITE_CATEGORIAS} categorias.`);
      } else {
        toastError("Ocorreu um erro ao criar a categoria.");
      }
    }

    actionsheet({
      setModalVisivel,
      setNomeCategoria,
      setIconeSelecionado,
      setError,
    });
  };

  const handleRemove = (idCategory: number | null) => {
    try {
      if (idCategory === null) return;
      const results = deleteCategory(idCategory);
      if (results) {
        setCategorias((prev) => prev.filter((c) => c.id !== idCategory));
        toastSuccess("Categoria removida com sucesso!");
      } else {
        toastError("Ocorreu um erro ao remover a categoria.");
      }
    } catch (error) {
      toastError("Ocorreu um erro ao remover a categoria.");
    }
  };

  useEffect(() => {
    const time = setTimeout(() => {
      try {
        const categoriasDb = getCategories();

        setCategorias(categoriasDb);
        if (!listasCarregadas) {
          carregarListas();
        }
      } catch (error) {
        toastError("Ocorreu um erro ao carregar as categorias.");
      } finally {
        setLoading(false);
      }
    }, 0);
    return () => clearTimeout(time);
  }, [isFocused]);

  return (
    <View
      style={[
        globalStyles.safe,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
      onStartShouldSetResponderCapture={() => {
        closeAllSwipes(openSwipeRef);
        Keyboard.dismiss();
        return false;
      }}
    >
      <View style={globalStyles.container}>
        <View style={styles.header}>
          <View>
            <Text style={globalStyles.title}>Categorias</Text>
            <Text style={globalStyles.subtitle}>Listas organizadas</Text>
          </View>

          {categorias.length > 0 && (
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => setModalVisivel(true)}
            >
              <Plus size={18} color={"#fff"} />
              <Text style={styles.buttonText}>Nova categoria</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.divider} />

        {loading ? (
          <View style={globalStyles.emptyContainer}>
            <LoadingDots style={globalStyles.emptyText} />
          </View>
        ) : categorias.length === 0 ? (
          <View style={globalStyles.emptyContainer}>
            <View style={globalStyles.iconCircle}>
              <LayoutGrid size={32} color={colors.subtext} />
            </View>

            <Text style={globalStyles.emptyTitle}>Sem categorias</Text>
            <Text style={globalStyles.emptyText}>
              Crie categorias para organizar suas listas de compras.
            </Text>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
                { marginTop: 20 },
              ]}
              onPress={() => setModalVisivel(true)}
            >
              <Plus size={18} color={"#fff"} />
              <Text style={styles.buttonText}>Nova categoria</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={categorias}
            // key={isFocused ? "focused" : "unfocused"}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            windowSize={5}
            initialNumToRender={8}
            maxToRenderPerBatch={5}
            removeClippedSubviews={true}
            renderItem={({ item: categoria, index }) => {
              const totalListas = listas.filter(
                (l) => l.category_id === categoria.id
              ).length;
              return (
                <Animated.View
                  entering={
                    animationsEnabled
                      ? FadeIn.duration(300).delay(index * 60)
                      : undefined
                  }
                >
                  <CategoriaAccordion
                    categoria={categoria}
                    totalListas={totalListas}
                    setListas={setListas}
                    openSwipeRef={openSwipeRef}
                    handleRemove={handleRemove}
                  />
                </Animated.View>
              );
            }}
          />
        )}
      </View>

      <CategoryModal
        visible={modalVisivel}
        onClose={() => setModalVisivel(false)}
        nomeCategoria={nomeCategoria}
        setNomeCategoria={setNomeCategoria}
        iconeSelecionado={iconeSelecionado}
        setIconeSelecionado={setIconeSelecionado}
        error={error}
        handleCreateCategory={handleCreateCategory}
        setError={setError}
      />
    </View>
  );
}

const makeStyles = (colors: any) =>
  StyleSheet.create({
    header: {
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "flex-start",
      flexWrap: "wrap",
      gap: 8,
    },

    button: {
      backgroundColor: colors.primary,
      paddingVertical: 9,
      paddingHorizontal: 12,
      borderRadius: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      alignSelf: "stretch",
      flexBasis: "auto",
      width: "100%",
    },

    buttonPressed: {
      opacity: 0.7,
    },

    buttonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 13,
    },

    listContainer: {
      paddingTop: 10,
      paddingBottom: 100,
    },

    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginTop: 12,
      marginHorizontal: -20,
    },
  });
