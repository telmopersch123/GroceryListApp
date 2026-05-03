import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";

export function LoadingDots({
  text = "Carregando",
  style,
}: {
  text?: string;
  style?: any;
}) {
  const [dots, setDots] = useState("");
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.Text style={[style, { opacity }]}>
      {text}
      {dots}
    </Animated.Text>
  );
}
