import { useSettings } from "@/app/context/SettingsContext";
import { saveUserPreferences } from "../../database/userPreferencesRepository";

import { useGlobalStyles } from "@/constants/globalStyles";

import React, { useEffect, useState } from "react";

import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { NotificationsDate } from "../json/notificationsjson";
import { scheduleNotifications } from "../utils/notifications";

type ShoppingPeriod = "inicio" | "meio" | "final" | "inicio_final";
interface PropsOnboarding {
  onFinish: () => void;
}
export default function Onboarding({ onFinish }: PropsOnboarding) {
  const { colors } = useSettings();
  const globalStyles = useGlobalStyles();
  const styles = createStyles(colors);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const progressValue = useSharedValue(50);
  const [period, setPeriod] = useState<ShoppingPeriod | null>(null);
  const progressAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progressValue.value}%`,
    };
  });
  async function handleContinue() {
    if (step === 1) {
      if (!name.trim()) return;

      setStep(2);
      return;
    }

    if (!period) return;
    saveUserPreferences({
      username: name.trim(),
      shopping_period: period,
      onboarding_completed: 1,
    });

    await scheduleNotifications(name.trim(), period);

    onFinish();
  }
  useEffect(() => {
    progressValue.value = withSpring(step === 1 ? 50 : 100, {
      damping: 18,
      stiffness: 120,
    });
  }, [step]);
  return (
    <SafeAreaView style={globalStyles.safe}>
      <KeyboardAvoidingView
        style={globalStyles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            <Animated.View style={[styles.progress, progressAnimatedStyle]} />
          </View>
        </View>

        <View style={styles.content}>
          {step === 1 ? (
            <>
              <Text style={globalStyles.title}>Como podemos te chamar?</Text>

              <Text style={globalStyles.subtitle}>
                Queremos deixar sua experiência mais personalizada.
              </Text>

              <View style={globalStyles.inputContainer}>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Digite seu nome..."
                  placeholderTextColor={colors.placeholder}
                  style={globalStyles.input}
                  maxLength={20}
                />
              </View>
            </>
          ) : (
            <>
              <Text style={globalStyles.title}>Antes de terminarmos...</Text>

              <Text style={globalStyles.subtitle}>
                Para que possamos oferecer uma experiência personalizada,
                informe-nos em quais períodos você costuma realizar suas
                compras.
              </Text>

              <View style={styles.optionsContainer}>
                {NotificationsDate.map((item) => {
                  const selected = period === item.id;

                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => setPeriod(item.id as ShoppingPeriod)}
                      style={[
                        styles.optionButton,
                        {
                          borderColor: selected
                            ? colors.primary
                            : colors.border,

                          backgroundColor: selected
                            ? `${colors.primary}15`
                            : colors.card,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          {
                            color: selected ? colors.primary : colors.text,
                          },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}
        </View>

        <Pressable
          onPress={handleContinue}
          disabled={(step === 1 && !name.trim()) || (step === 2 && !period)}
          style={({ pressed }) => [
            globalStyles.saveButton,
            {
              opacity:
                pressed ||
                (step === 1 && !name.trim()) ||
                (step === 2 && !period)
                  ? 0.7
                  : 1,
            },
          ]}
        >
          <Text style={globalStyles.saveText}>
            {step === 1 ? "Continuar" : "Finalizar"}
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(colors: any) {
  return StyleSheet.create({
    header: {
      marginBottom: 50,
    },

    progressContainer: {
      width: "100%",
      height: 6,
      backgroundColor: colors.border,
      borderRadius: 999,
      overflow: "hidden",
    },

    progress: {
      height: "100%",
      borderRadius: 999,
      backgroundColor: colors.primary,
    },

    content: {
      flex: 1,
      justifyContent: "center",
    },

    optionsContainer: {
      gap: 14,
      marginTop: 10,
    },

    optionButton: {
      paddingVertical: 18,
      paddingHorizontal: 18,
      borderRadius: 18,
      borderWidth: 1.5,
    },

    optionText: {
      fontSize: 15,
      fontWeight: "600",
    },
  });
}
