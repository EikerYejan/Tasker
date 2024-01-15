import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {useMemo} from "react";
import {useMediaQuery} from "react-responsive";
import {useTranslation} from "react-i18next";
import Icon from "react-native-vector-icons/Ionicons";
import {router} from "expo-router";

import {ScreenWrapper} from "../../components/ScreenWrapper";
import {Task} from "../../components/Task/Task";

import {useAppState} from "../../store/store";
import {useAppearance} from "../../hooks/useAppearance";
import {useBiometrics} from "../../hooks/useBiometrics";

import {Alert} from "../../utils/alert/alert";

import {TABLET_WIDTH} from "../../constants/mediaQueries";
import {COLORS} from "../../constants/colors";
import {FONTS} from "../../constants/fonts";
import {ScreenName} from "../../types";

import type {Theme} from "@react-navigation/native";

export default function HomeScreen() {
  const isTablet = useMediaQuery({minWidth: TABLET_WIDTH});

  const {
    markAsDone,
    markAsTodo,
    removeTodo,
    state: {done, todos},
  } = useAppState();

  const {theme} = useAppearance();
  const styles = useMemo(() => getStyles(theme), [theme]);

  const {
    biometricsEnrolled,
    biometricsSupported,
    locked: tasksLockedByBiometrics,
    onLockPress: onTogleBiometrics,
  } = useBiometrics();

  const {t} = useTranslation();

  const onDelete = (id: string, done = false) => {
    if (!done) {
      Alert.alert(
        t("home.alert.deleteTask"),
        t("home.alert.deleteTaskConfirmation"),
        [
          {
            text: t("alert.cancel"),
            style: "cancel",
          },
          {
            text: t("alert.delete"),
            onPress: () => removeTodo(id),
            style: "destructive",
          },
        ],
      );
    }
  };

  const onEdit = (id: string) => {
    router.push({
      pathname: ScreenName.TASK,
      params: {taskId: id},
    });
  };

  const onCreatePress = () => {
    router.push(ScreenName.TASK);
  };

  const biometricsIconName = useMemo(() => {
    if (!biometricsSupported || Platform.OS === "web") return "";

    if (biometricsEnrolled) {
      return tasksLockedByBiometrics
        ? "lock-closed-outline"
        : "lock-open-outline";
    }

    return "finger-print-outline";
  }, [biometricsEnrolled, biometricsSupported, tasksLockedByBiometrics]);

  return (
    <ScreenWrapper>
      <ScrollView
        indicatorStyle="black"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>{t("home.title")}</Text>
        <Text style={styles.pageDescription}>{t("home.welcome")}</Text>
        <View
          style={[
            styles.contentGrid,
            isTablet ? styles.contentGridTablet : {},
          ]}>
          <View
            style={[
              styles.contentRow,
              isTablet ? styles.contentRowTablet : {},
            ]}>
            <View style={styles.sectionContainer}>
              <View style={styles.todoSectionHeader}>
                <Text style={styles.sectionHeading}>{t("home.todoTitle")}</Text>
                <View style={styles.todoSectionActions}>
                  {biometricsSupported && biometricsIconName && (
                    <Pressable onPress={onTogleBiometrics}>
                      <Icon
                        color={theme.colors.text}
                        name={biometricsIconName}
                        size={25}
                      />
                    </Pressable>
                  )}
                </View>
              </View>
              <View style={styles.tasksWrapper}>
                {todos.map(task => (
                  <Task
                    item={task}
                    locked={tasksLockedByBiometrics}
                    key={task.id}
                    onComplete={markAsDone}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onPress={onEdit}
                  />
                ))}
              </View>
            </View>
            {done.length ? (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionHeading}>{t("home.doneTitle")}</Text>
                <View style={styles.tasksWrapper}>
                  {done.map(task => (
                    <Task
                      item={task}
                      locked={tasksLockedByBiometrics}
                      key={task.id}
                      onDelete={removeTodo}
                      onRestore={markAsTodo}
                    />
                  ))}
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
      <Pressable style={styles.createTaskButton} onPress={onCreatePress}>
        <Icon color={COLORS.WHITE} name="add-outline" size={40} />
      </Pressable>
    </ScreenWrapper>
  );
}

const getStyles = (theme: Theme) => {
  const {colors} = theme;

  return StyleSheet.create({
    pageTitle: {
      color: colors.text,
      fontFamily: FONTS.POPPINS_BOLD,
      fontSize: 45,
      fontWeight: "700",
      lineHeight: 50,
    },
    contentGrid: {
      gap: 20,
    },
    contentGridTablet: {
      flexDirection: "row",
      flexWrap: "nowrap",
      gap: 60,
      justifyContent: "space-between",
    },
    contentRow: {
      width: "100%",
    },
    contentRowTablet: {
      flexDirection: "row",
      gap: 50,
    },
    pageDescription: {
      color: colors.text,
      fontFamily: FONTS.POPPINS_REGULAR,
      fontSize: 16,
      fontWeight: "400",
      marginBottom: 30,
    },
    sectionHeading: {
      color: colors.text,
      fontFamily: FONTS.POPPINS_BOLD,
      fontSize: 24,
      fontWeight: "700",
      marginBottom: 12,
    },
    input: {
      marginBottom: 16,
    },
    textArea: {
      height: 100,
    },
    tasksWrapper: {
      borderBottomWidth: 0,
      borderColor: colors.border,
      borderWidth: 1,
    },
    sectionContainer: {
      marginBottom: 18,
      flex: 1,
    },
    lockButtonText: {
      color: colors.link,
      fontFamily: FONTS.POPPINS_MEDIUM,
      fontSize: 14,
    },
    todoSectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      flexWrap: "nowrap",
    },
    todoSectionActions: {
      alignItems: "center",
      flexDirection: "row",
      flexWrap: "nowrap",
    },
    createTaskButton: {
      alignItems: "center",
      backgroundColor: COLORS.GREY,
      borderRadius: 8,
      bottom: 10,
      elevation: 14,
      flexDirection: "row",
      height: 50,
      justifyContent: "center",
      position: "absolute",
      right: Platform.select({
        web: 20,
        native: 20,
      }),
      shadowColor: COLORS.BLACK,
      shadowOffset: {width: 0, height: 7},
      shadowOpacity: 0.41,
      shadowRadius: 9.11,
      width: 50,
    },
  });
};
