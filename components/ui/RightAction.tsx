import { Trash2 } from "lucide-react-native";
import { Pressable, Text } from "react-native";

import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

export function RightAction({
  prog,
  drag,
  onRemover,
}: {
  prog: SharedValue<number>;
  drag: SharedValue<number>;
  onRemover: () => void;
}) {
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: drag.value + 80 }],
  }));

  return (
    <Animated.View
      style={[
        animStyle,
        {
          justifyContent: "center",
          marginBottom: 10,
        },
      ]}
    >
      <Pressable
        onPress={onRemover}
        style={{
          backgroundColor: "#D32F2F",
          justifyContent: "center",
          alignItems: "center",
          width: 72,
          height: "100%",
          borderRadius: 12,
          gap: 4,
        }}
      >
        <Trash2 size={20} color="#fff" />
        <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>
          Remover
        </Text>
      </Pressable>
    </Animated.View>
  );
}
