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

const SettingsContext = createContext({
  animationsEnabled: true,
  setAnimationsEnabled: (val: boolean) => {},
  colors: Colors.light,
  isDark: false,
  toggleTheme: () => {},
  themeAnim: new Animated.Value(0),
  notification: false,
  setNotification: (val: boolean) => {},
  progressStyle: "line",
  setProgressStyle: (val: "line" | "circle") => {},
});

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isDark, setIsDark] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [notification, setNotification] = useState(true);
  const [progressStyle, setProgressStyle] = useState<"line" | "circle">("line");
  const themeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadSettings = async () => {
      const [theme, animations, notif, progress] = await Promise.all([
        AsyncStorage.getItem("theme"),
        AsyncStorage.getItem("animationsEnabled"),
        AsyncStorage.getItem("notification"),
        AsyncStorage.getItem("progressStyle"),
      ]);
      setIsDark(theme === "dark");
      if (animations !== null) setAnimationsEnabled(animations === "true");
      if (notif !== null) setNotification(notif === "true");
      if (progress === "line" || progress === "circle")
        setProgressStyle(progress);
      themeAnim.setValue(0);
    };
    loadSettings();
  }, []);

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

  const handleSetAnimationsEnabled = (val: boolean) => {
    setAnimationsEnabled(val);
    AsyncStorage.setItem("animationsEnabled", String(val));
  };

  const handleSetNotification = (val: boolean) => {
    setNotification(val);
    AsyncStorage.setItem("notification", String(val));
  };

  const handleSetProgressStyle = (val: "line" | "circle") => {
    setProgressStyle(val);
    AsyncStorage.setItem("progressStyle", val);
  };

  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <SettingsContext.Provider
      value={{
        animationsEnabled,
        setAnimationsEnabled: handleSetAnimationsEnabled,
        colors,
        isDark,
        toggleTheme,
        themeAnim,
        notification,
        setNotification: handleSetNotification,
        progressStyle,
        setProgressStyle: handleSetProgressStyle,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
