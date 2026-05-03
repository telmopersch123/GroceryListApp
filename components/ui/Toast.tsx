import { useSettings } from "@/app/context/SettingsContext";
import { showToast } from "@/app/hooks/useToast";
import { CheckCircle, Info, XCircle } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";

type ToastType = "success" | "error" | "info";

interface Props {
  visible: boolean;
  type: ToastType;
  text1: string;
  text2?: string;
  onHide: () => void;
  visibilityTime?: number;
  id: number;
}

export function Toast({
  visible,
  type,
  text1,
  text2,
  onHide,
  visibilityTime = 3000,
  id,
}: Props) {
  const { colors } = useSettings();
  const translateX = useRef(new Animated.Value(400)).current;

  const config = {
    success: {
      icon: <CheckCircle size={22} color={colors.primary} />,
      accent: colors.primary,
    },
    error: {
      icon: <XCircle size={22} color={colors.error} />,
      accent: colors.error,
    },
    info: {
      icon: <Info size={22} color={colors.tint} />,
      accent: colors.tint,
    },
  };

  useEffect(() => {
    if (visible) {
      translateX.setValue(400);
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 8,
      }).start();

      const timeout = setTimeout(() => {
        Animated.timing(translateX, {
          toValue: 400,
          duration: 250,
          useNativeDriver: true,
        }).start(() => onHide());
      }, visibilityTime);

      return () => clearTimeout(timeout);
    }
  }, [id]);

  return (
    <Animated.View
      style={{
        transform: [{ translateX }],
        position: "absolute",
        bottom: 32,
        right: 16,
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 22,
        minWidth: 260,
        borderLeftWidth: 5,
        borderLeftColor: config[type].accent,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 6,
        zIndex: 9999,
        width: "90%",
        maxWidth: 380,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
        {config[type].icon}

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: colors.text,
            }}
          >
            {text1}
          </Text>

          {text2 && (
            <Text
              style={{
                fontSize: 14,
                color: colors.subtext,
                marginTop: 4,
              }}
            >
              {text2}
            </Text>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

export const toastSuccess = (msg: string) => {
  showToast({ type: "success", text1: "Pronto", text2: msg });
};

export const toastError = (msg: string) => {
  showToast({ type: "error", text1: "Ops", text2: msg });
};
