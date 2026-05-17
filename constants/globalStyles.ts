// constants/globalStyles.ts

import { useSettings } from "@/app/context/SettingsContext";
import { StyleSheet } from "react-native";
// ← seu context

export const useGlobalStyles = () => {
  const { colors } = useSettings(); // ← useSettings, não useTheme

  return StyleSheet.create({
    // ← return na mesma linha
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colors.background,
    },
    containerRow: {
      padding: 15,
      gap: 12,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.text,
    },
    titleSecondary: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
    },
    subtitle: {
      fontSize: 16,
      color: colors.subtext,
      marginTop: 4,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 40,
    },
    iconCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.iconCircle,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
      textAlign: "center",
    },
    emptyText: {
      fontSize: 14,
      color: colors.placeholder,
      textAlign: "center",
      lineHeight: 20,
    },
    inputError: {
      borderWidth: 1,
      borderColor: colors.error,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 5,
      backgroundColor: colors.card,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      flex: 1,
      minWidth: 100,
      maxWidth: "100%",
    },
    actionButtonPressed: {
      backgroundColor: colors.inputBg,
      borderColor: colors.border,
      transform: [{ scale: 0.97 }],
    },
    addButton: {
      backgroundColor: colors.primary,
      width: 45,
      height: 45,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    error: {
      color: colors.error,
      padding: 5,
      pointerEvents: "none",
    },
    input: {
      backgroundColor: colors.inputBg,
      color: colors.text,
      padding: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "transparent",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    label: {
      fontSize: 14,
      color: colors.subtext,
      marginBottom: 5,
    },
    buttonContainer: {
      position: "absolute",
      bottom: 20,
      left: 20,
      right: 20,
      backgroundColor: colors.background,
    },
    saveButton: {
      backgroundColor: colors.primary,
      margin: 20,
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: 8,
    },
    saveText: {
      color: "#fff",
      fontWeight: "bold",
    },
    trashButton: {
      padding: 5,
    },
    listContainer: {
      paddingHorizontal: 20,
      marginTop: 10,
    },
    itemCard: {
      backgroundColor: colors.card,
      padding: 14,
      borderRadius: 10,
      marginBottom: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    itemText: {
      fontSize: 16,
      color: colors.text,
    },
    card: {
      backgroundColor: colors.card,
      padding: 15,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
      borderLeftWidth: 4,
      borderLeftColor: "#1B5E20",
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
    },
    iconContainer: {
      flexDirection: "row",
      gap: 8,
    },
    iconButton: {
      padding: 4,
      borderRadius: 6,
    },
    progressRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginTop: 10,
    },
    progressContainer: {
      height: 8,
      backgroundColor: colors.border,
      borderRadius: 10,
      marginTop: 10,
      overflow: "hidden",
      flex: 1,
    },
    progressBar: {
      width: "0%",
      height: "100%",
      backgroundColor: colors.primary,
    },
    progressText: {
      marginTop: 5,
      fontSize: 12,
      color: colors.subtext,
    },
    itemsText: {
      marginTop: 5,
      fontSize: 13,
      color: colors.iconColor,
    },
    floatingButton: {
      backgroundColor: "#EF7D0B",
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      right: 20,
    },
    floatingButtonPressed: {
      opacity: 0.7,
    },
    inputContainer: {
      marginBottom: 15,
      marginTop: 10,
    },
  });
};
