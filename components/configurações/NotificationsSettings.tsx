import { useSettings } from "@/app/context/SettingsContext";
import {
  getUserPreferences,
  updatePeriod,
  UserPreferences,
} from "@/app/database/userPreferencesRepository";
import { showToast } from "@/app/hooks/useToast";
import { NotificationsDate } from "@/app/json/notificationsjson";
import { BellRing, Check, ChevronDown } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type ColorScheme = ReturnType<typeof useSettings>["colors"];

export const NotificationsSettings = () => {
  const [notificationsUser, setNotificationsUser] =
    useState<UserPreferences | null>(null);

  const [open, setOpen] = useState(false);

  const { colors } = useSettings();

  const styles = useMemo(() => makeStyles(colors), [colors]);

  useEffect(() => {
    try {
      const fetchNotifications = getUserPreferences();
      setNotificationsUser(fetchNotifications);
    } catch (error) {
      console.log("Erro ao carregar as notificações: ", error);
    }
  }, []);

  const toggleDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setOpen(!open);
  };
  const handleSelect = (value: string, id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    updatePeriod(value, id);

    setNotificationsUser({
      ...notificationsUser,
      shopping_period: value,
    } as UserPreferences);

    showToast({
      type: "success",
      text1: "Pronto",
      text2: "Período atualizado",
    });
    setOpen(false);
  };
  const selectedOption = NotificationsDate.find(
    (item) => item.id === notificationsUser?.shopping_period
  );

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.iconLabel}>
          <BellRing size={22} color="#337539" />

          <View style={styles.textContainer}>
            <Text style={styles.label}>Período de Compras</Text>

            <Text style={styles.description}>
              Preferência usada para personalizar notificações
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.dropdownWrapper}>
        <Pressable
          style={({ pressed }) => [
            styles.select,
            pressed && styles.selectPressed,
            open && styles.selectOpen,
          ]}
          onPress={toggleDropdown}
        >
          <Text
            numberOfLines={1}
            style={[styles.selectText, !selectedOption && styles.placeholder]}
          >
            {selectedOption?.label || "Selecione um período"}
          </Text>

          <ChevronDown size={18} color={colors.subtext} />
        </Pressable>

        {open && (
          <View style={styles.dropdown}>
            {NotificationsDate.map((item, index) => {
              const selected = item.id === notificationsUser?.shopping_period;

              return (
                <Pressable
                  key={item.id}
                  onPress={() =>
                    handleSelect(item.id, notificationsUser!.id ?? 0)
                  }
                  style={({ pressed }) => [
                    styles.option,
                    pressed && styles.optionPressed,
                    index !== NotificationsDate.length - 1 &&
                      styles.optionBorder,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selected && styles.optionSelectedText,
                    ]}
                  >
                    {item.label}
                  </Text>

                  {selected && <Check size={16} color={colors.primary} />}
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
};

const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      paddingVertical: 12,
    },

    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },

    iconLabel: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },

    textContainer: {
      marginLeft: 12,
      flex: 1,
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
      lineHeight: 18,
    },

    dropdownWrapper: {
      position: "relative",
      zIndex: 999,
    },

    select: {
      backgroundColor: colors.inputBg,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 14,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",

      minHeight: 54,
    },

    selectOpen: {
      borderColor: colors.primary,
    },

    selectPressed: {
      opacity: 0.8,
    },

    selectText: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
      marginRight: 10,
    },

    placeholder: {
      color: colors.placeholder,
    },

    dropdown: {
      position: "absolute",
      top: 62,
      left: 0,
      right: 0,

      backgroundColor: colors.card,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,

      overflow: "hidden",

      zIndex: 999,
      elevation: 10,

      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 10,
    },

    option: {
      paddingHorizontal: 14,
      paddingVertical: 14,

      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    optionPressed: {
      backgroundColor: colors.inputBg,
    },

    optionBorder: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    optionText: {
      fontSize: 14,
      color: colors.text,
      flex: 1,
      paddingRight: 10,
    },

    optionSelectedText: {
      color: colors.primary,
      fontWeight: "600",
    },
  });
