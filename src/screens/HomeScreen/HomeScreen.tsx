import {Platform, Pressable, ScrollView, Text, View} from "react-native";
import {useMemo} from "react";
import {useMediaQuery} from "react-responsive";
import {useTranslation} from "react-i18next";
import {useNavigation} from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

import {ScreenWrapper} from "../../components/ScreenWrapper";
import {Task} from "../../components/Task/Task";

import {useAppState} from "../../store/store";
import {useAppearance} from "../../hooks/useAppearance";
import {useBiometrics} from "../../hooks/useBiometrics";

import {Alert} from "../../utils/alert/alert";
import {getStyles} from "./styles";

import {TABLET_WIDTH} from "../../constants/mediaQueries";
import {COLORS} from "../../constants/colors";

import {ScreenName, type UseNavigation} from "../../types";

export const HomeScreen = () => {
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
  const {navigate} = useNavigation<UseNavigation>();

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
    navigate(ScreenName.TASK, {taskId: id});
  };

  const onCreatePress = () => {
    navigate(ScreenName.TASK, {});
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.page}>
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
};
