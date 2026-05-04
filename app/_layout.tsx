import { Toast } from "@/components/ui/Toast";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SettingsProvider, useSettings } from "./context/SettingsContext";

import { ListsProvider } from "./context/ListsContext";
import { useToast } from "./hooks/useToast";

function AppContent() {
  const { toast, hide } = useToast();
  const { colors, isDark } = useSettings();

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
          name="criar-lista"
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
