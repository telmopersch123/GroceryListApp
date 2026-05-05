import Colors from "@/constants/Colors";
import { useGlobalStyles } from "@/constants/globalStyles";
import { Moon, Sparkles } from "lucide-react-native";
import React, { useMemo } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettings } from "../context/SettingsContext";
type ColorScheme = typeof Colors.light;
export default function Configurações() {
  const {
    animationsEnabled,
    setAnimationsEnabled,
    isDark,
    toggleTheme,
    colors,
  } = useSettings();

  const globalStyles = useGlobalStyles();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        globalStyles.safe,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={[globalStyles.container, styles.pagePadding]}>
        <Text style={globalStyles.title}>Configurações</Text>
        <Text style={globalStyles.subtitle}>Preferências de exibição</Text>
        <View
          style={{
            height: 1,
            backgroundColor: colors.border,
            marginTop: 12,
            marginHorizontal: -20,
          }}
        />

        <View style={styles.card}>
          {/* Opção: Animações */}
          <View style={styles.row}>
            <View style={styles.iconLabel}>
              <Sparkles size={22} color="#337539" />
              <View style={styles.textContainer}>
                <Text style={styles.label}>Interface Animada</Text>
                <Text style={styles.description}>
                  Transições e efeitos visuais
                </Text>
              </View>
            </View>
            <Switch
              value={animationsEnabled}
              onValueChange={setAnimationsEnabled}
              trackColor={{
                false: colors.border,
                true: colors.primary,
              }}
              thumbColor="#fff"
              ios_backgroundColor={colors.border}
            />
          </View>

          <View style={styles.divider} />

          {/* Opção: Dark Mode */}
          <View style={styles.row}>
            <View style={styles.iconLabel}>
              <Moon size={22} color="#337539" />
              <View style={styles.textContainer}>
                <Text style={styles.label}>Modo Escuro</Text>
                <Text style={styles.description}>
                  Visual confortável para a noite
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{
                false: colors.border,
                true: colors.primary,
              }}
              thumbColor="#fff"
              ios_backgroundColor={colors.border}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    pagePadding: {
      paddingHorizontal: 20,
    },

    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginTop: 20,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
    },
    iconLabel: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    textContainer: {
      marginLeft: 12,
    },
    label: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
    },
    description: {
      fontSize: 12,
      color: colors.subtext,
      marginTop: 2,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginLeft: 34,
    },
  });
