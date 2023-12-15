import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useState } from "react";

import { ScreenWrapper } from "../components/ScreenWrapper";
import { Button } from "../components/Button/Button";
import { TextInput } from "../components/TextInput/TextInput";
import { Task } from "../components/Task/Task";

import { useAppState } from "../store/store";

import { FONTS } from "../constants/fonts";
import { COLORS } from "../constants/colors";
import { generateId } from "../utils";
import { useMediaQuery } from "react-responsive";
import { TABLET_WIDTH } from "../constants/mediaQueries";

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: 45,
    fontWeight: "700",
    fontFamily: FONTS.POPPINS_BOLD,
    lineHeight: 50,
  },
  contentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 60,
    justifyContent: "space-between",
  },
  contentGridTablet: {
    flexWrap: "nowrap",
  },
  contentRow: {
    width: "100%",
  },
  contentRowTablet: {
    maxWidth: "50%",
    width: "50%",
  },
  pageDescription: {
    fontFamily: FONTS.POPPINS_REGULAR,
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 30,
  },
  sectionHeading: {
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
    borderColor: COLORS.BLACK,
    borderWidth: 1,
  },
  sectionContainer: {
    marginBottom: 18,
  },
  page: {
    ...(Platform.OS === "web"
      ? {
          marginLeft: "auto",
          marginRight: "auto",
          maxWidth: 1420,
          width: "100%",
        }
      : {}),
  },
});

export const HomeScreen = () => {
  const isTablet = useMediaQuery({ minWidth: TABLET_WIDTH });

  const [taskTitle, setTaskTitle] = useState<string>("");
  const [taskDescription, setTaskDescription] = useState<string>("");

  const {
    addTodo,
    markAsDone,
    markAsTodo,
    removeTodo,
    state: { done, name, todos },
  } = useAppState();

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
      if (Platform.OS === "web" && window.confirm("Delete task?")) {
        removeTodo(id, done);

        return;
      }

      Alert.alert("Delete task", "Are you sure you want to delete this task?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => removeTodo?.(id),
          style: "destructive",
        },
      ]);
    }
  };

  const saveDisabled = !taskTitle || !taskDescription;

  return (
    <ScreenWrapper>
      <View style={styles.page}>
        <Text style={styles.pageTitle}>Ahoy! {name}</Text>
        <Text style={styles.pageDescription}>Welcome to Tasker</Text>
        <View
          style={[styles.contentGrid, isTablet ? styles.contentGridTablet : {}]}
        >
          <View
            style={[styles.contentRow, isTablet ? styles.contentRowTablet : {}]}
          >
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
            />
            <Button label="Save" disabled={saveDisabled} onPress={onSave} />
          </View>
          <ScrollView
            alwaysBounceVertical={false}
            indicatorStyle="black"
            keyboardDismissMode="interactive"
            scrollIndicatorInsets={{ right: -3 }}
            style={[styles.contentRow, isTablet ? styles.contentRowTablet : {}]}
          >
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionHeading}>To do:</Text>
              <View style={styles.tasksWrapper}>
                {todos.map((task) => (
                  <Task
                    item={task}
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
                  {done.map((task) => (
                    <Task
                      item={task}
                      key={task.id}
                      onDelete={removeTodo}
                      onRestore={markAsTodo}
                    />
                  ))}
                </View>
              </View>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </ScreenWrapper>
  );
};
