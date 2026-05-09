import Colors from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Animated } from "react-native";
const DURATION = 180;

const SettingsContext = createContext({
  animationsEnabled: true,
  setAnimationsEnabled: (val: boolean) => {},
  colors: Colors.light,
  isDark: false,
  toggleTheme: () => {},
  themeAnim: new Animated.Value(0),
  notification: false,
  setNotification: (val: boolean) => {},
});

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isDark, setIsDark] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [notification, setNotification] = useState(true);

  const themeAnim = useRef(new Animated.Value(0)).current;

  const toggleTheme = () => {
    const next = !isDark;

    if (!animationsEnabled) {
      setIsDark(next);
      AsyncStorage.setItem("theme", next ? "dark" : "light");
      return;
    }

    themeAnim.setValue(0);

    Animated.timing(themeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsDark(next);
      AsyncStorage.setItem("theme", next ? "dark" : "light");

      Animated.timing(themeAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start();
    });
  };

  useEffect(() => {
    const loadTheme = async () => {
      const saved = await AsyncStorage.getItem("theme");
      const dark = saved === "dark";

      setIsDark(dark);
      themeAnim.setValue(0);
    };

    loadTheme();
  }, []);

  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <SettingsContext.Provider
      value={{
        animationsEnabled,
        setAnimationsEnabled,
        colors,
        isDark,
        toggleTheme,
        themeAnim,
        notification,
        setNotification,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
