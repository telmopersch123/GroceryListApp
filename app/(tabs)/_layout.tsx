import { Tabs } from "expo-router";
import {
  LayoutGrid,
  Settings,
  ShoppingBasket,
  Star,
} from "lucide-react-native";
import { Animated } from "react-native";
import { useSettings } from "../context/SettingsContext";

export default function TabLayout() {
  const { colors, themeAnim } = useSettings();
  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: themeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.3],
        }),
      }}
    >
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarActiveBackgroundColor: colors.background,
          tabBarInactiveBackgroundColor: colors.background,
          tabBarInactiveTintColor: colors.subtext,
          tabBarStyle: {
            height: 60,
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Início",
            tabBarIcon: ({ color, focused }) => (
              <ShoppingBasket size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="favoritos"
          options={{
            title: "Favoritos",
            tabBarIcon: ({ color, focused }) => (
              <Star
                size={24}
                color={color}
                fill={focused ? color : "transparent"}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="categorias"
          options={{
            title: "Categorias",
            tabBarIcon: ({ color, focused }) => (
              <LayoutGrid
                size={24}
                color={color}
                fill={focused ? color : "transparent"}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="configuracoes"
          options={{
            title: "Configurações",
            tabBarIcon: ({ color, focused }) => (
              <Settings size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </Animated.View>
  );
}
