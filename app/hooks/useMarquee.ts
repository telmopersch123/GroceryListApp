// hooks/useMarquee.ts
import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

export function useMarquee(text: string) {
  const translateX = useRef(new Animated.Value(0)).current;
  const textWidth = useRef(0);
  const containerWidth = useRef(0);
  const animRef = useRef<Animated.CompositeAnimation | null>(null);
  const measuredRef = useRef(false);
  const safeText = text.trim().length === 0 ? " " : text;
  const shouldAnimate = safeText.trim().length > 30;
  function startAnimation() {
    if (!shouldAnimate) return;
    if (textWidth.current === 0 || containerWidth.current === 0) return;
    if (textWidth.current <= containerWidth.current) return;

    animRef.current?.stop();
    const exitTo = -textWidth.current;
    const enterFrom = containerWidth.current;
    const duration = (textWidth.current + containerWidth.current) * 22;

    translateX.setValue(0);

    translateX.setValue(0);
    animRef.current = Animated.loop(
      Animated.sequence([
        // desliza da posição inicial até sair pela esquerda
        Animated.timing(translateX, {
          toValue: exitTo,
          duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // teleporta para fora pela direita
        Animated.timing(translateX, {
          toValue: enterFrom,
          duration: 0,
          useNativeDriver: true,
        }),
        // desliza de volta ao centro vindo da direita
        Animated.timing(translateX, {
          toValue: 0,
          duration: containerWidth.current * 22,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );
    animRef.current.start();
  }

  useEffect(() => {
    return () => animRef.current?.stop();
  }, []);

  useEffect(() => {
    animRef.current?.stop();
    translateX.setValue(0);
    textWidth.current = 0;
    measuredRef.current = false;
  }, [text]);

  return {
    translateX,
    shouldAnimate,
    onHiddenTextLayout: (e: any) => {
      if (measuredRef.current) return;
      measuredRef.current = true;
      textWidth.current = e.nativeEvent.layout.width;
      startAnimation();
    },
    onContainerLayout: (e: any) => {
      containerWidth.current = e.nativeEvent.layout.width;
      startAnimation();
    },
  };
}
