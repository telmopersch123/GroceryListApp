import { NotificationsSettings } from "@/components/configurações/NotificationsSettings";
import { ProgressStyleSelector } from "@/components/configurações/ProgressStyleSelector";
import { ReportModal } from "@/components/suporte/ReportModal";
import Colors from "@/constants/Colors";
import { useGlobalStyles } from "@/constants/globalStyles";
import { Bell, Bug, Lightbulb, Moon, Sparkles } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettings } from "../context/SettingsContext";
type ColorScheme = typeof Colors.light;
export default function Configurações() {
  const {
    animationsEnabled,
    setAnimationsEnabled,
    isDark,
    toggleTheme,
    notification,
    setNotification,
    colors,
    progressStyle,
    setProgressStyle,
  } = useSettings();
  const [reportVisible, setReportVisible] = useState(false);
  const [typeModal, setTypeModal] = useState<"bug" | "feature">("bug");
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
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
        showsVerticalScrollIndicator={false}
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

            <View style={styles.divider} />

            {/* Opção: Mensagens */}
            <View style={styles.row}>
              <View style={styles.iconLabel}>
                <Bell size={22} color="#337539" />
                <View style={styles.textContainer}>
                  <Text style={styles.label}>Avisos</Text>
                  <Text numberOfLines={2} style={styles.description}>
                    Feedback visual de sucesso
                  </Text>
                </View>
              </View>
              <Switch
                value={notification}
                onValueChange={setNotification}
                trackColor={{
                  false: colors.border,
                  true: colors.primary,
                }}
                thumbColor="#fff"
                ios_backgroundColor={colors.border}
              />
            </View>

            <View style={styles.divider} />
            <NotificationsSettings />
            <View style={styles.divider} />
            {/* Opção: Estilo de Progresso */}
            <ProgressStyleSelector
              progressStyle={progressStyle as "line" | "circle"}
              setProgressStyle={setProgressStyle}
              colors={colors}
            />
          </View>
          <View>
            <Text style={styles.sectionTitle}>Suporte</Text>

            <Text style={styles.sectionSubtitle}>Feedback e ajuda</Text>

            <View style={styles.card}>
              <Pressable
                style={({ pressed }) => [
                  styles.row,
                  pressed && {
                    opacity: 0.7,
                  },
                ]}
                onPress={() => {
                  setTypeModal("bug");
                  setReportVisible(true);
                }}
              >
                <View style={styles.iconLabel}>
                  <Bug size={22} color="#337539" />

                  <View style={styles.textContainer}>
                    <Text style={styles.label}>Reportar problema</Text>

                    <Text style={styles.description}>
                      Ajude a melhorar o aplicativo
                    </Text>
                  </View>
                </View>
              </Pressable>

              <View style={styles.divider} />

              <Pressable
                style={({ pressed }) => [
                  styles.row,
                  pressed && {
                    opacity: 0.7,
                  },
                ]}
                onPress={() => {
                  setTypeModal("feature");
                  setReportVisible(true);
                }}
              >
                <View style={styles.iconLabel}>
                  <Lightbulb size={22} color="#337539" />

                  <View style={styles.textContainer}>
                    <Text style={styles.label}>Sugerir funcionalidade</Text>

                    <Text style={styles.description}>
                      Compartilhe uma ideia conosco
                    </Text>
                  </View>
                </View>
              </Pressable>
            </View>

            <ReportModal
              visible={reportVisible}
              onClose={() => setReportVisible(false)}
              type={typeModal}
            />
          </View>
        </View>
      </ScrollView>
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
      flex: 1,
      marginRight: 12,
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
    sectionTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
      marginTop: 34,
    },

    sectionSubtitle: {
      fontSize: 14,
      color: colors.subtext,
      marginTop: 4,
      marginBottom: -8,
    },
  });
