import {Platform, Pressable, ScrollView, Text, View} from "react-native";
import {useMemo, useState} from "react";
import {useMediaQuery} from "react-responsive";
import {useTranslation} from "react-i18next";
import {useNavigation} from "@react-navigation/native";

import {ScreenWrapper} from "../../components/ScreenWrapper";
import {Button} from "../../components/Button/Button";
import {TextInput} from "../../components/TextInput/TextInput";
import {Task} from "../../components/Task/Task";

import {useAppState} from "../../store/store";
import {useAppearance} from "../../hooks/useAppearance";
import {useBiometrics} from "../../hooks/useBiometrics";

import {generateId} from "../../utils";
import {Alert} from "../../utils/alert/alert";
import {getStyles} from "./styles";

import {TABLET_WIDTH} from "../../constants/mediaQueries";

import {ScreenName} from "../../types";

export const HomeScreen = () => {
  const isTablet = useMediaQuery({minWidth: TABLET_WIDTH});

  const [taskTitle, setTaskTitle] = useState<string>("");
  const [taskDescription, setTaskDescription] = useState<string>("");

  const {
    addTodo,
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
    sensorType,
  } = useBiometrics();

  const {i18n, t} = useTranslation();
  const {navigate} = useNavigation<any>();

  const onSave = () => {
    if (!taskTitle || !taskDescription) return;

    addTodo({
      description: taskDescription,
      id: generateId().toString(),
      title: taskTitle,
    });

    setTaskTitle("");
    setTaskDescription("");
  };

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
    navigate(ScreenName.EDIT_TASK, {taskId: id});
  };

  const biometricsButtonText = useMemo(() => {
    if (!biometricsSupported) return null;

    let text = "";

    if (biometricsEnrolled) {
      text = tasksLockedByBiometrics
        ? t("biometrics.button.unlock")
        : t("biometrics.button.lock");
    } else {
      text = t("biometrics.button.enroll");
    }

    return text.replace("{sensorType}", sensorType ?? "");
  }, [
    biometricsEnrolled,
    biometricsSupported,
    i18n.language,
    sensorType,
    tasksLockedByBiometrics,
  ]);

  const saveDisabled = !taskTitle || !taskDescription;

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
            <Text style={styles.sectionHeading}>{t("home.newTask")}</Text>
            <TextInput
              placeholder={t("home.input.taskTitle")}
              style={styles.input}
              value={taskTitle}
              onChangeText={setTaskTitle}
            />
            <TextInput
              multiline
              placeholder={t("home.input.taskDescription")}
              value={taskDescription}
              style={[styles.input, styles.textArea]}
              onChangeText={setTaskDescription}
              onSubmitEditing={onSave}
            />
            <Button
              label={t("home.button.saveTask")}
              disabled={saveDisabled}
              onPress={onSave}
            />
          </View>
          <View
            style={[
              styles.contentRow,
              isTablet ? styles.contentRowTablet : {},
            ]}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionHeading}>{t("home.todoTitle")}</Text>
              {biometricsSupported && Platform.OS !== "web" && (
                <Pressable
                  style={styles.lockButton}
                  onPress={onTogleBiometrics}>
                  <Text style={styles.lockButtonText}>
                    {biometricsButtonText}
                  </Text>
                </Pressable>
              )}
              <View style={styles.tasksWrapper}>
                {todos.map(task => (
                  <Task
                    item={task}
                    locked={tasksLockedByBiometrics}
                    key={task.id}
                    onComplete={markAsDone}
                    onDelete={onDelete}
                    onEdit={onEdit}
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
    </ScreenWrapper>
  );
};
