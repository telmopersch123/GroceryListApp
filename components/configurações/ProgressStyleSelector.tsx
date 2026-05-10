import { ChartBar } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
const PROGRESS_COLOR = "#337539";
const DURATION = 300;
function SelectionCard({
  selected,
  onPress,
  colors,
  children,
  label,
}: {
  selected: boolean;
  onPress: () => void;
  colors: any;
  children: React.ReactNode;
  label: string;
}) {
  const progress = useSharedValue(selected ? 1 : 0);

  if (progress.value !== (selected ? 1 : 0)) {
    progress.value = withTiming(selected ? 1 : 0, { duration: DURATION });
  }

  function handlePress() {
    progress.value = withTiming(1, { duration: DURATION });
    onPress();
  }

  const animatedBorder = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      [colors.border, PROGRESS_COLOR]
    ),
  }));

  const animatedText = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      [colors.text, PROGRESS_COLOR]
    ),
  }));

  return (
    <Pressable onPress={handlePress} style={{ flex: 1 }}>
      <Animated.View
        style={[
          {
            borderWidth: 2,
            borderRadius: 12,
            padding: 12,
            backgroundColor: colors.card,
            gap: 8,
          },
          animatedBorder,
        ]}
      >
        {children}
        <Animated.Text
          style={[
            { fontSize: 13, fontWeight: "500", textAlign: "center" },
            animatedText,
          ]}
        >
          {label}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

export function ProgressStyleSelector({
  progressStyle,
  setProgressStyle,
  colors,
}: {
  progressStyle: "line" | "circle";
  setProgressStyle: (val: "line" | "circle") => void;
  colors: any;
}) {
  return (
    <View style={{ paddingVertical: 12 }}>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
      >
        <ChartBar size={22} color={PROGRESS_COLOR} />
        <View style={{ marginLeft: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: "500", color: colors.text }}>
            Estilo do progresso
          </Text>
          <Text style={{ fontSize: 12, color: colors.subtext, marginTop: 2 }}>
            Visualização nas suas listas
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <SelectionCard
          selected={progressStyle === "line"}
          onPress={() => setProgressStyle("line")}
          colors={colors}
          label="Linha"
        >
          <View
            style={{
              backgroundColor: colors.background,
              borderRadius: 8,
              borderLeftWidth: 3,
              borderLeftColor: PROGRESS_COLOR,
              padding: 8,
              gap: 6,
            }}
          >
            <View
              style={{
                height: 6,
                backgroundColor: colors.border,
                borderRadius: 4,
                width: "80%",
              }}
            />
            <View
              style={{
                height: 3,
                backgroundColor: colors.border,
                borderRadius: 99,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: "60%",
                  height: "100%",
                  backgroundColor: PROGRESS_COLOR,
                  borderRadius: 99,
                }}
              />
            </View>
            <View
              style={{
                height: 6,
                backgroundColor: colors.border,
                borderRadius: 4,
                width: "50%",
              }}
            />
          </View>
        </SelectionCard>

        <SelectionCard
          selected={progressStyle === "circle"}
          onPress={() => setProgressStyle("circle")}
          colors={colors}
          label="Círculo"
        >
          <View
            style={{
              backgroundColor: colors.background,
              borderRadius: 8,
              borderLeftWidth: 3,
              borderLeftColor: PROGRESS_COLOR,
              padding: 8,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Svg
              width={32}
              height={32}
              viewBox="0 0 36 36"
              style={{ transform: [{ rotate: "-90deg" }] }}
            >
              <Circle
                cx={18}
                cy={18}
                r={14}
                fill="none"
                stroke={colors.border}
                strokeWidth={3}
              />
              <Circle
                cx={18}
                cy={18}
                r={14}
                fill="none"
                stroke={PROGRESS_COLOR}
                strokeWidth={3}
                strokeDasharray={87.96}
                strokeDashoffset={35.2}
                strokeLinecap="round"
              />
            </Svg>
            <View style={{ gap: 4, flex: 1 }}>
              <View
                style={{
                  height: 6,
                  backgroundColor: colors.border,
                  borderRadius: 4,
                  width: "80%",
                }}
              />
              <View
                style={{
                  height: 6,
                  backgroundColor: colors.border,
                  borderRadius: 4,
                  width: "50%",
                }}
              />
            </View>
          </View>
        </SelectionCard>
      </View>
    </View>
  );
}
