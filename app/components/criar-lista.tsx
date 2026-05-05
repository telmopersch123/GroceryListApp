import { TrashButton } from "@/components/ui/trashButton";
import { useGlobalStyles } from "@/constants/globalStyles";
import { useRouter } from "expo-router";
import { ArrowLeft, Plus, Save } from "lucide-react-native";
import { useState } from "react";
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLists } from "../context/ListsContext";
import { useSettings } from "../context/SettingsContext";
import { createItem, LIMITE_ITENS } from "../database/listItemsRepository";
import { createList, LIMITE_LISTAS } from "../database/listsRepository";
import { showToast } from "../hooks/useToast";

export default function CriarLista() {
  const { colors, animationsEnabled } = useSettings();
  const globalStyles = useGlobalStyles();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setListas } = useLists();
  const [nomeLista, setNomeLista] = useState("");
  const [item, setItem] = useState("");
  const [erroNome, setErroNome] = useState("");
  const [erroItem, setErroItem] = useState("");
  const [ItensList, setItensList] = useState<{ id: number; name: string }[]>(
    []
  );

  function handleSalvar() {
    let temErro = false;

    if (!nomeLista.trim()) {
      setErroNome("O nome da lista é obrigatório.");
      temErro = true;
    } else {
      setErroNome("");
    }

    if (!item.trim() && ItensList.length === 0) {
      setErroItem("Adicione pelo menos um item");
      temErro = true;
    } else {
      setErroItem("");
    }

    if (ItensList.length === 0) {
      setErroItem("Adicione pelo menos um item");
      temErro = true;
    }

    if (temErro) return;
    try {
      const novaLista = createList(nomeLista.trim());

      ItensList.forEach((item) => {
        createItem(novaLista.id, item.name);
      });
      const listaComItens = {
        ...novaLista,
        itens: ItensList.map((item, i) => ({
          id: i,
          list_id: novaLista.id,
          name: item.name,
          checked: false,
        })),
      };
      setListas((prev) => [listaComItens, ...prev]);
      router.back();

      showToast({
        type: "success",
        text1: "Pronto",
        text2: "A sua lista foi criada com sucesso!",
      });
    } catch (error: any) {
      if (error.message === "LIMITE_LISTAS") {
        showToast({
          type: "error",
          text1: `Limite de ${LIMITE_LISTAS} listas atingido.`,
        });
      } else if (error.message === "LIMITE_ITENS") {
        showToast({
          type: "error",
          text1: `Limite de ${LIMITE_ITENS} itens por lista atingido.`,
        });
      } else {
        showToast({
          type: "error",
          text1: "Ocorreu um erro ao criar a lista.",
        });
      }
    }
  }

  function handleRemover(id: number) {
    setItensList((prev) => prev.filter((item) => item.id !== id));
  }

  function handleAddItem() {
    if (!item.trim()) return;

    if (ItensList.length >= LIMITE_ITENS) {
      setErroItem(`Limite de ${LIMITE_ITENS} itens por lista atingido.`);
      return;
    }
    const novoItem = {
      id: Date.now(),
      name: item,
      list_id: null,
      checked: false,
    };

    setItensList((prev) => [...prev, novoItem]);
    setItem("");
    setErroItem("");
  }

  return (
    <View
      style={[
        globalStyles.safe,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={globalStyles.containerRow}>
        <Pressable onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </Pressable>

        <Text style={globalStyles.titleSecondary}>Nova Lista</Text>
      </View>

      {/* INPUTS */}
      <View style={styles.container}>
        <View style={{ marginBottom: 5 }}>
          <Text style={globalStyles.label}>Nome da lista</Text>

          <TextInput
            placeholder="Ex: Compras do mês de Janeiro"
            placeholderTextColor="#9E9E9E"
            value={nomeLista}
            maxLength={35}
            onChangeText={(text) => {
              setNomeLista(text);
              if (text.trim()) setErroNome("");
            }}
            style={[globalStyles.input, erroNome && globalStyles.inputError]}
          />

          <Text style={globalStyles.error}>{erroNome || " "}</Text>
        </View>

        <Text style={globalStyles.label}>Itens da sua lista</Text>

        <View style={globalStyles.row}>
          <TextInput
            placeholder="Adicionar item..."
            placeholderTextColor="#9E9E9E"
            value={item}
            maxLength={35}
            onChangeText={(text) => {
              setItem(text);
              if (text.length >= 35)
                return setErroItem("Limite de 35 caracteres");
              if (text.trim()) setErroItem("");
            }}
            style={[
              globalStyles.input,
              { flex: 1 },
              erroItem && globalStyles.inputError,
            ]}
          />

          <Pressable
            onPress={() => {
              Keyboard.dismiss();
              handleAddItem();
            }}
            style={globalStyles.addButton}
          >
            <Plus size={20} color="#fff" />
          </Pressable>
        </View>

        <Text style={globalStyles.error}>{erroItem || " "}</Text>
      </View>

      {/* LISTA */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <View style={globalStyles.listContainer}>
          {ItensList.map((item) => (
            <Animated.View
              key={item.id}
              entering={animationsEnabled ? FadeIn.duration(120) : undefined}
              exiting={animationsEnabled ? FadeOut.duration(120) : undefined}
              layout={
                animationsEnabled ? LinearTransition.duration(180) : undefined
              }
              style={globalStyles.itemCard}
            >
              <Text style={globalStyles.itemText}>{item.name}</Text>

              <TrashButton
                onPress={() => handleRemover(item.id)}
                color={colors.text}
              />
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      {/* BOTÃO SALVAR */}
      <View style={globalStyles.buttonContainer}>
        <Pressable style={globalStyles.saveButton} onPress={handleSalvar}>
          <Save size={18} color="#fff" />
          <Text style={globalStyles.saveText}>Criar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
