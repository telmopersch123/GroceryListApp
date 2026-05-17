import { useSettings } from "@/app/context/SettingsContext";
import * as Application from "expo-application";
import * as Device from "expo-device";
import { Bug, Info, Lightbulb, SendHorizonal } from "lucide-react-native";

import React, { useState } from "react";

import {
  Keyboard,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  type: "bug" | "feature";
}

export function ReportModal({ visible, onClose, type }: Props) {
  const { colors, isDark } = useSettings();

  const [message, setMessage] = useState("");

  const isBug = type === "bug";

  async function handleSend() {
    if (!message.trim()) return;
    Keyboard.dismiss();

    try {
      const email = "grocerylistappsuporte@outlook.com";
      const subject = encodeURIComponent(
        isBug ? "Bug Report - GroceryList" : "Feature Suggestion - GroceryList"
      );
      const body = encodeURIComponent(
        `${message}\n\n---\nPlataforma: ${Platform.OS}\nVersão: ${
          Application.nativeApplicationVersion || "Unknown"
        }\nSistema: ${Device.osVersion || "Unknown"}\nTema: ${
          isDark ? "Dark" : "Light"
        }`
      );

      await Linking.openURL(`mailto:${email}?subject=${subject}&body=${body}`);
      setMessage("");
      onClose();
    } catch (error) {
      alert("Não foi possível abrir o app de email.");
    }
  }

  const styles = makeStyles(colors);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            overScrollMode="never"
          >
            <View style={styles.iconContainer}>
              {isBug ? (
                <Bug size={28} color={colors.primary} />
              ) : (
                <Lightbulb size={28} color={colors.primary} />
              )}
            </View>

            <Text style={styles.title}>
              {isBug
                ? "Encontrou algum problema?"
                : "Tem uma ideia para o app?"}
            </Text>

            <Text style={styles.subtitle}>
              {isBug
                ? "Explique o problema encontrado e, se possível, descreva com detalhes como ele aconteceu."
                : "Compartilhe sua ideia com clareza e explique como essa funcionalidade poderia melhorar sua experiência no GroceryList."}
            </Text>

            <TextInput
              multiline
              value={message}
              onChangeText={setMessage}
              placeholder={
                isBug
                  ? "Descreva o problema aqui..."
                  : "Descreva a sua ideia aqui..."
              }
              placeholderTextColor={colors.subtext}
              style={styles.input}
              textAlignVertical="top"
              maxLength={1000}
            />
            <View style={styles.counterContainer}>
              <Text style={styles.counterText}>{message.length}/1000</Text>
            </View>

            <View style={styles.infoBox}>
              <Info size={18} color={colors.primary} />

              <Text style={styles.infoText}>
                Informações técnicas serão incluídas automaticamente.
              </Text>
            </View>

            <Pressable
              disabled={!message.trim()}
              onPress={handleSend}
              style={({ pressed }) => [
                styles.button,
                !message.trim() && { opacity: 0.4 },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={styles.buttonText}>
                {isBug ? "Enviar relatório" : "Enviar sugestão"}
              </Text>
              <SendHorizonal size={18} color="#fff" />
            </Pressable>

            <Pressable
              onPress={() => {
                setMessage("");
                onClose();
              }}
            >
              <Text style={styles.cancel}>Cancelar</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const makeStyles = (colors: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.55)",
      justifyContent: "center",
      alignItems: "center",
    },

    modal: {
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: 22,
      borderWidth: 1,
      borderColor: colors.border,
      maxHeight: "80%",
    },

    iconContainer: {
      width: 72,
      height: 72,
      borderRadius: 999,
      backgroundColor: `${colors.primary}15`,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      marginBottom: 20,
    },

    title: {
      color: colors.text,
      fontSize: 24,
      fontWeight: "700",
      textAlign: "center",
    },

    subtitle: {
      color: colors.subtext,
      fontSize: 15,
      textAlign: "center",
      marginTop: 10,
      lineHeight: 22,
      marginBottom: 22,
    },

    input: {
      minHeight: 140,
      maxHeight: 200,
      backgroundColor: colors.background,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      color: colors.text,
      fontSize: 15,
    },

    infoBox: {
      flexDirection: "row",
      gap: 10,
      marginTop: 18,
      padding: 14,
      borderRadius: 16,
      backgroundColor: colors.background,
      alignItems: "flex-start",
    },

    infoText: {
      flex: 1,
      color: colors.subtext,
      fontSize: 13,
      lineHeight: 20,
    },

    button: {
      height: 56,
      backgroundColor: colors.primary,
      borderRadius: 18,
      marginTop: 22,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 10,
    },

    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "700",
    },

    cancel: {
      textAlign: "center",
      marginTop: 18,
      color: colors.primary,
      fontSize: 15,
      fontWeight: "600",
    },
    counterContainer: {
      alignItems: "flex-end",
      marginTop: 8,
    },

    counterText: {
      color: colors.subtext,
      fontSize: 12,
    },
  });
