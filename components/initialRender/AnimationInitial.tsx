// import { useSettings } from "@/app/context/SettingsContext";
// import { StatusBar } from "expo-status-bar";
// import LottieView from "lottie-react-native";
// import { Platform, View } from "react-native";
// import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";

// export const AnimationInitial = () => {
//   const { colors, isDark } = useSettings();
//   if (Platform.OS === "web") return null;

//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: colors.background,
//         paddingHorizontal: 24,
//       }}
//     >
//       <StatusBar style={isDark ? "light" : "dark"} />

//       <Animated.View entering={ZoomIn.duration(900).springify()}>
//         <LottieView
//           source={require("../../assets/animations/Getthingsdone.json")}
//           autoPlay
//           loop
//           style={{ width: 320, height: 320 }}
//         />
//       </Animated.View>

//       <Animated.Text
//         entering={FadeIn.duration(1200)}
//         style={{
//           marginTop: -20,
//           fontSize: 17,
//           fontWeight: "600",
//           color: colors.text,
//           textAlign: "center",
//           letterSpacing: 0.3,
//         }}
//       >
//         Estamos ajeitando tudo para você!
//       </Animated.Text>

//       <Animated.Text
//         entering={FadeIn.delay(300).duration(1200)}
//         style={{
//           marginTop: 10,
//           fontSize: 14,
//           color: colors.subtext,
//           textAlign: "center",
//           lineHeight: 22,
//           maxWidth: 280,
//         }}
//       >
//         Preparando sua experiência no GroceryList...
//       </Animated.Text>
//     </View>
//   );
// };
