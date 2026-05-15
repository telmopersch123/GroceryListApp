import { Toast } from "@/components/ui/Toast";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SettingsProvider, useSettings } from "./context/SettingsContext";

import * as Notifications from "expo-notifications";
import {
  cancelAllNotifications,
  scheduleNotifications,
} from "./utils/notifications";

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
        const userpass = getUserPreferences();
        setShowOnboarding(!userpass?.username);
        await scheduleNotifications(
          userpass?.username || "Amigo",
          userpass?.shopping_period || "final"
        );
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      } finally {
        setLoading(false);
      }
    }
    checkOnboarding();
  }, []);

  if (showOnboarding) {
    return (
      <>
        <StatusBar style={isDark ? "light" : "dark"} />
        <Onboarding onFinish={() => setShowOnboarding(false)} />
      </>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style={isDark ? "light" : "dark"} />

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
            headerShown: true,
            title: "Nova lista",
          }}
        />
      </Stack>

      <Toast {...toast} onHide={hide} />
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
