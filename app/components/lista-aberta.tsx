import { useSettings } from "@/app/context/SettingsContext";
import {
  getItemsByListId,
  toggleItem as toggleItemDb,
} from "@/app/database/listItemsRepository";
import { getListById } from "@/app/database/listsRepository";
import { ICONES } from "@/components/categorias/categoriaAccordion";
import { useGlobalStyles } from "@/constants/globalStyles";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Check, Heart, Pencil, Tag, X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getCategories } from "../database/categoriesRepository";
import { Categoria, TypeItens, TypeListRenderHome } from "../types/typesGlobal";

export default function ListaAberta() {
  const globalStyles = useGlobalStyles();
  const { colors } = useSettings();
  const styles = makeStyles(colors);

  const router = useRouter();
  const params = useLocalSearchParams();
  const progressAnim = useRef(new Animated.Value(0)).current;

  const [modalCategorias, setModalCategorias] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<
    number | null
  >(null);
  const [itens, setItens] = useState<TypeItens[]>([]);
  const [lista, setLista] = useState<TypeListRenderHome>();
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const total = itens.length;
  const concluidos = itens.filter((item) => item.checked).length;
  const porcentagem = total === 0 ? 0 : (concluidos / total) * 100;

  const widthInterpolada = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: porcentagem,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [porcentagem]);

  useEffect(() => {
    console.log("Parâmetros recebidos:", params.id);
    if (params.id) {
      const id = Number(params.id);
      const listaDb = getListById(id);

      if (listaDb) {
        setLista(listaDb);
        setItens(getItemsByListId(id));
        setCategoriaSelecionada(listaDb.category_id);
      }
    }

    setCategorias(getCategories());
  }, [params.id]);

  function toggleItem(id: number) {
    setItens((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          toggleItemDb(id, !item.checked);
          return { ...item, checked: !item.checked };
        }
        return item;
      })
    );
  }

  const categoriaAtual = categorias.find((c) => c.id === categoriaSelecionada);

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>{lista?.name}</Text>
      </View>

      {/* PROGRESS */}
      <View style={styles.progressRow}>
        <View style={styles.progressContainer}>
          <Animated.View
            style={[styles.progressBar, { width: widthInterpolada }]}
          />
        </View>
        <Text style={styles.percent}>{Math.round(porcentagem)}%</Text>
      </View>

      <Text style={styles.subText}>
        {concluidos} de {total} itens adicionados no carrinho
      </Text>

      {/* ACTIONS */}
      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            globalStyles.actionButton,
            pressed && globalStyles.actionButtonPressed,
          ]}
          onPress={() =>
            router.push({
              pathname: "/components/editar-lista",
              params: { id: lista?.id },
            })
          }
        >
          <Pencil size={16} color={colors.text} />
          <Text style={styles.actionText}>Editar</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            globalStyles.actionButton,
            pressed && globalStyles.actionButtonPressed,
          ]}
        >
          <Heart size={16} color={colors.text} />
          <Text style={styles.actionText}>Favoritar</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            globalStyles.actionButton,
            pressed && globalStyles.actionButtonPressed,
          ]}
          onPress={() => setModalCategorias(true)}
        >
          <Tag
            size={16}
            color={categoriaSelecionada ? colors.primary : colors.text}
          />
          <Text
            style={[
              styles.actionText,
              categoriaSelecionada ? { color: colors.primary } : null,
            ]}
          >
            {categoriaAtual ? categoriaAtual.nome : "Categorizar"}
          </Text>
        </Pressable>
      </View>

      {/* LISTA */}
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {itens.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => toggleItem(item.id)}
            style={[styles.itemCard, item.checked && styles.itemChecked]}
          >
            <View style={[styles.circle, item.checked && styles.circleChecked]}>
              {item.checked && <Check size={14} color="#fff" />}
            </View>
            <Text
              style={[styles.itemText, item.checked && styles.itemTextChecked]}
            >
              {item.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* MODAL */}
      <Modal
        visible={modalCategorias}
        transparent
        animationType="fade"
        onRequestClose={() => setModalCategorias(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Categorizar lista</Text>
              <Pressable onPress={() => setModalCategorias(false)}>
                <X size={20} color={colors.text} />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={{ gap: 12 }}>
              {categorias.map((categoria) => {
                const Icone = ICONES[parseInt(categoria.icon)];
                const selecionado = categoriaSelecionada === categoria.id;

                return (
                  <Pressable
                    key={categoria.id}
                    style={[
                      styles.categoriaItem,
                      selecionado && styles.categoriaItemSelecionado,
                    ]}
                    onPress={() => {
                      setCategoriaSelecionada(
                        selecionado ? null : categoria.id
                      );
                      setModalCategorias(false);
                    }}
                  >
                    <View
                      style={[
                        styles.categoriaIcone,
                        selecionado && styles.categoriaIconeSelecionado,
                      ]}
                    >
                      <Icone
                        size={20}
                        color={selecionado ? "#fff" : colors.primary}
                      />
                    </View>

                    <Text
                      style={[
                        styles.categoriaNome,
                        selecionado && { color: colors.primary },
                      ]}
                    >
                      {categoria.nome}
                    </Text>

                    {selecionado && <Check size={18} color={colors.primary} />}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const makeStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 15,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
    },
    progressRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    progressContainer: {
      flex: 1,
      height: 8,
      backgroundColor: colors.border,
      borderRadius: 10,
      overflow: "hidden",
    },
    progressBar: {
      height: "100%",
      backgroundColor: colors.primary,
    },
    percent: {
      fontSize: 12,
      color: colors.subtext,
    },
    subText: {
      marginTop: 5,
      fontSize: 13,
      color: colors.subtext,
    },
    actions: {
      flexDirection: "row",
      gap: 10,
      marginVertical: 15,
    },
    actionText: {
      fontSize: 13,
      color: colors.text,
    },
    itemCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      padding: 14,
      borderRadius: 10,
      marginBottom: 10,
      gap: 10,
    },
    circle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
    },
    circleChecked: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    itemChecked: {
      opacity: 0.6,
    },
    itemText: {
      fontSize: 16,
      color: colors.text,
    },
    itemTextChecked: {
      textDecorationLine: "line-through",
      color: colors.subtext,
    },
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modal: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 24,
      width: "90%",
      maxHeight: "80%",
      gap: 12,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
    },
    categoriaItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    categoriaItemSelecionado: {
      borderColor: colors.primary,
      backgroundColor: colors.inputBg,
    },
    categoriaIcone: {
      width: 38,
      height: 38,
      borderRadius: 8,
      backgroundColor: colors.inputBg,
      justifyContent: "center",
      alignItems: "center",
    },
    categoriaIconeSelecionado: {
      backgroundColor: colors.primary,
    },
    categoriaNome: {
      flex: 1,
      fontSize: 15,
      color: colors.text,
    },
  });
