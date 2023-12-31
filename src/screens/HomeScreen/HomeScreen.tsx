import {Pressable, ScrollView, Text, View} from "react-native";
import {useMemo, useState} from "react";
import {useMediaQuery} from "react-responsive";

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

export const HomeScreen = () => {
  const isTablet = useMediaQuery({minWidth: TABLET_WIDTH});

  const [taskTitle, setTaskTitle] = useState<string>("");
  const [taskDescription, setTaskDescription] = useState<string>("");

  const {
    addTodo,
    markAsDone,
    markAsTodo,
    removeTodo,
    state: {done, user, todos},
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
      Alert.alert("Delete task", "Are you sure you want to delete this task?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => removeTodo(id),
          style: "destructive",
        },
      ]);
    }
  };

  const biometricsButtonText = useMemo(() => {
    if (!biometricsSupported) return null;

    if (biometricsEnrolled) {
      return tasksLockedByBiometrics
        ? `Unlock with ${sensorType}`
        : `Lock Tasks`;
    }

    return `Enable ${sensorType} Lock`;
  }, [
    biometricsEnrolled,
    biometricsSupported,
    sensorType,
    tasksLockedByBiometrics,
  ]);

  const saveDisabled = !taskTitle || !taskDescription;

  return (
    <ScreenWrapper>
      <ScrollView
        indicatorStyle="black"
        keyboardDismissMode="interactive"
        scrollIndicatorInsets={{right: -3}}
        contentContainerStyle={styles.page}>
        <Text style={styles.pageTitle}>Ahoy! {user?.displayName}</Text>
        <Text style={styles.pageDescription}>Welcome to Tasker</Text>
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
            <Text style={styles.sectionHeading}>Add new task</Text>
            <TextInput
              placeholder="Task Title"
              style={styles.input}
              value={taskTitle}
              onChangeText={setTaskTitle}
            />
            <TextInput
              multiline
              placeholder="Task Description"
              value={taskDescription}
              style={[styles.input, styles.textArea]}
              onChangeText={setTaskDescription}
              onSubmitEditing={onSave}
            />
            <Button label="Save" disabled={saveDisabled} onPress={onSave} />
          </View>
          <View
            style={[
              styles.contentRow,
              isTablet ? styles.contentRowTablet : {},
            ]}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionHeading}>To do:</Text>
              {biometricsSupported && (
                <Pressable
                  style={styles.lockButton}
                  onPress={onTogleBiometrics}>
                  <Text style={styles.pageDescription}>
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
                  />
                ))}
              </View>
            </View>
            {done.length ? (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionHeading}>Done:</Text>
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
