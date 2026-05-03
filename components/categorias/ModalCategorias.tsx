import { X } from "lucide-react-native";
import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useSettings } from "@/app/context/SettingsContext";
import { ICONES } from "@/components/categorias/categoriaAccordion";
import { IconeButton } from "@/components/categorias/iconeButton";
import Colors from "@/constants/Colors";
import { useGlobalStyles } from "@/constants/globalStyles";

type ColorScheme = typeof Colors.light;

type Props = {
  visible: boolean;
  onClose: () => void;
  nomeCategoria: string;
  setNomeCategoria: (text: string) => void;
  iconeSelecionado: number;
  setIconeSelecionado: (index: number) => void;
  error: string;
  handleCreateCategory: () => void;
  setError: (text: string) => void;
};

export const CategoryModal = ({
  visible,
  onClose,
  nomeCategoria,
  setNomeCategoria,
  iconeSelecionado,
  setIconeSelecionado,
  error,
  setError,
  handleCreateCategory,
}: Props) => {
  const globalStyles = useGlobalStyles();
  const { colors } = useSettings();
  const styles = makeStyles(colors);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modal} onPress={() => {}}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nova Categoria</Text>
            <Pressable onPress={onClose}>
              <X size={20} color={colors.text} />
            </Pressable>
          </View>

          <View style={globalStyles.inputContainer}>
            <Text style={globalStyles.label}>NOME DA CATEGORIA</Text>
            <TextInput
              placeholder="Ex: Limpeza"
              placeholderTextColor="#9E9E9E"
              value={nomeCategoria}
              onChangeText={(text) => {
                setError("");
                setNomeCategoria(text);
              }}
              maxLength={30}
              style={[
                globalStyles.input,
                {
                  borderColor: "rgba(128,128,128,0.2)",
                },
                error && globalStyles.inputError,
              ]}
            />
            <Text style={globalStyles.error}>{error || " "}</Text>
          </View>

          <Text style={styles.label}>ÍCONE</Text>
          <View style={styles.iconGrid}>
            {ICONES.map((Icone, index) => (
              <IconeButton
                key={index}
                Icone={Icone}
                index={index}
                selecionado={iconeSelecionado === index}
                onPress={setIconeSelecionado}
              />
            ))}
          </View>

          <View style={styles.modalFooter}>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
            <Pressable onPress={handleCreateCategory} style={styles.saveButton}>
              <Text style={styles.saveText}>Salvar</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
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
      gap: 10,
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
    label: {
      fontSize: 11,
      fontWeight: "600",
      color: colors.subtext,
      letterSpacing: 0.8,
      marginTop: -15,
    },

    iconGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 4,
      justifyContent: "center",
    },
    modalFooter: {
      flexDirection: "row",
      gap: 10,
    },
    cancelButton: {
      flex: 1,
      padding: 14,
      borderRadius: 10,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    cancelText: {
      color: colors.text,
      fontWeight: "600",
    },
    saveButton: {
      flex: 1,
      backgroundColor: colors.primary,
      padding: 14,
      borderRadius: 10,
      alignItems: "center",
    },
    saveText: {
      color: "#fff",
      fontWeight: "bold",
    },
  });
