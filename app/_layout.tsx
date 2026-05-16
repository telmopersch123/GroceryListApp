import { Toast } from "@/components/ui/Toast";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { FadeIn, SlideInRight } from "react-native-reanimated";
import { SettingsProvider, useSettings } from "./context/SettingsContext";

import * as Notifications from "expo-notifications";
import {
  cancelAllNotifications,
  scheduleNotifications,
} from "./utils/notifications";

import { AnimationInitial } from "@/components/ui/AnimationInitial";
import { useEffect, useState } from "react";
import Onboarding from "./components/onboarding";
import { ListsProvider } from "./context/ListsContext";
import { getUserPreferences } from "./database/userPreferencesRepository";
import { useToast } from "./hooks/useToast";

function AppContent() {
  const { toast, hide } = useToast();
  const { colors, isDark } = useSettings();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   async function reset() {
  //     db.runSync(`DELETE FROM user_preferences`);
  //     console.log("resetado");
  //   }
  //   reset();
  // }, []);

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        if (response.actionIdentifier === "already_done") {
          cancelAllNotifications();
        }
      }
    );
    return () => sub.remove();
  }, []);
  useEffect(() => {
    async function checkOnboarding() {
      try {
        const start = Date.now();
        const userpass = getUserPreferences();
        setShowOnboarding(!userpass?.username);
        await scheduleNotifications(
          userpass?.username || "Amigo",
          userpass?.shopping_period || "final"
        );
        const elapsed = Date.now() - start;
        const minimumLoadingTime = 1800;
        if (elapsed < minimumLoadingTime) {
          await new Promise((resolve) =>
            setTimeout(resolve, minimumLoadingTime - elapsed)
          );
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      } finally {
        setLoading(false);
      }
    }
    checkOnboarding();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      {loading ? (
        <AnimationInitial />
      ) : showOnboarding ? (
        <Animated.View entering={FadeIn.duration(250)} style={{ flex: 1 }}>
          <Animated.View
            entering={SlideInRight.springify()}
            style={{ flex: 1 }}
          >
            <Onboarding onFinish={() => setShowOnboarding(false)} />
          </Animated.View>
        </Animated.View>
      ) : (
        <>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: colors.background,
              },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="components/criar-lista"
              options={{
                presentation: "modal",
                headerShown: false,
              }}
            />
          </Stack>

          <Toast {...toast} onHide={hide} />
        </>
      )}
    </View>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ListsProvider>
        <SettingsProvider>
          <AppContent />
        </SettingsProvider>
      </ListsProvider>
    </GestureHandlerRootView>
  );
}
