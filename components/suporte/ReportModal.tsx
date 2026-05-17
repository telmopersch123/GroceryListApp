import { useSettings } from "@/app/context/SettingsContext";
import { EMAILJS_CONFIG } from "@/services/emailjs";
import emailjs from "@emailjs/browser";
import * as Application from "expo-application";
import * as Device from "expo-device";
import {
  Bug,
  Info,
  Lightbulb,
  Loader2,
  SendHorizonal,
} from "lucide-react-native";

import React, { useEffect, useState } from "react";

import {
  Keyboard,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface Props {
  visible: boolean;
  onClose: () => void;
  type: "bug" | "feature";
}

export function ReportModal({ visible, onClose, type }: Props) {
  const { colors, isDark } = useSettings();
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  const isBug = type === "bug";

  async function handleSend() {
    if (!message.trim()) return;

    Keyboard.dismiss();

    try {
      setSending(true);

      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        {
          subject: isBug
            ? "Bug Report - GroceryList"
            : "Feature Suggestion - GroceryList",

          report_type: isBug ? "Bug Report" : "Feature Suggestion",

          message,

          app_version: Application.nativeApplicationVersion || "Unknown",

          platform: Platform.OS,

          os_version: Device.osVersion || "Unknown",

          theme: isDark ? "Dark" : "Light",
        },
        {
          publicKey: EMAILJS_CONFIG.PUBLIC_KEY,
        }
      );

      setMessage("");

      onClose();

      alert(
        isBug
          ? "Relatório enviado com sucesso!"
          : "Sugestão enviada com sucesso!"
      );
    } catch (error) {
      console.log(error);

      alert("Não foi possível enviar agora.");
    } finally {
      setSending(false);
    }
  }

  const rotation = useSharedValue(0);

  useEffect(() => {
    if (sending) {
      rotation.value = withRepeat(
        withTiming(360, {
          duration: 900,
          easing: Easing.linear,
        }),
        -1
      );
    } else {
      cancelAnimation(rotation);
      rotation.value = 0;
    }
    return () => {
      cancelAnimation(rotation);
    };
  }, [sending]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

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
          <View style={styles.iconContainer}>
            {isBug ? (
              <Bug size={28} color={colors.primary} />
            ) : (
              <Lightbulb size={28} color={colors.primary} />
            )}
          </View>

          <Text style={styles.title}>
            {isBug ? "Encontrou algum problema?" : "Tem uma ideia para o app?"}
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
            disabled={!message.trim() || sending}
            onPress={handleSend}
            style={({ pressed }) => [
              styles.button,
              !message.trim() && {
                opacity: 0.4,
              },
              pressed && {
                opacity: 0.8,
              },
            ]}
          >
            {sending ? (
              <>
                <Animated.View style={animatedStyle}>
                  <Loader2 size={18} color="#fff" />
                </Animated.View>
                <Text style={styles.buttonText}>Enviando...</Text>
              </>
            ) : (
              <>
                <Text style={styles.buttonText}>
                  {isBug ? "Enviar relatório" : "Enviar sugestão"}
                </Text>
                <SendHorizonal size={18} color="#fff" />
              </>
            )}
          </Pressable>

          <Pressable
            onPress={() => {
              setMessage("");
              onClose();
            }}
          >
            <Text style={styles.cancel}>Cancelar</Text>
          </Pressable>
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
      paddingHorizontal: 20,
    },

    modal: {
      backgroundColor: colors.card,
      borderRadius: 24,
      padding: 22,
      borderWidth: 1,
      borderColor: colors.border,
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
