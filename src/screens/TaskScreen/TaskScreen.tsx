import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {useEffect, useMemo, useRef} from "react";
import {useNavigation} from "@react-navigation/native";
import {useTranslation} from "react-i18next";
import {RichEditor, RichToolbar} from "react-native-pell-rich-editor";

import {ScreenWrapper} from "../../components/ScreenWrapper";
import {TextInput} from "../../components/TextInput/TextInput";
import {Button} from "../../components/Button/Button";

import {FONTS} from "../../constants/fonts";
import {actionsIcons, supportedEditorActions} from "./constants";

import {useAppearance} from "../../hooks/useAppearance";
import {useAppState} from "../../store/store";
import {generateId} from "../../utils";

import type {TextInput as RNTextInput} from "react-native";
import type {UseNavigation} from "../../types";

interface Props {
  taskId?: string;
}

export const TaskScreen = ({taskId}: Props) => {
  const navigation = useNavigation<UseNavigation>();
  const {colors} = useAppearance();
  const {addTodo, getItem, saveItem} = useAppState();

  const {t} = useTranslation();

  const item = useMemo(() => (taskId ? getItem(taskId) : null), [taskId]);

  const itemTitle = useRef(item?.title);
  const itemDescription = useRef(item?.description);

  const descriptionInput = useRef<RNTextInput>(null);

  const textEditor = useRef<RichEditor>(null);

  const styles = StyleSheet.create({
    actions: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    saveText: {
      color: colors.link,
      fontFamily: FONTS.POPPINS_BOLD,
      fontSize: 14,
      fontWeight: "bold",
    },
    saveButton: {
      marginTop: 30,
    },
    title: {
      color: colors.text,
      fontFamily: FONTS.POPPINS_BOLD,
      fontSize: 24,
      marginBottom: 15,
    },
    editorWrapper: {
      borderColor: colors.border,
      borderWidth: 1,
      height: 400,
      marginTop: 30,
    },
    fullHeight: {
      height: "100%",
    },
  });

  const onTitleChange = (text: string) => {
    itemTitle.current = text;
  };

  const onDescriptionChange = (text: string) => {
    itemDescription.current = text;
  };

  const onSavePress = async () => {
    if (item) {
      const newItem = {
        ...item,
        description: itemDescription.current ?? item?.description,
        title: itemTitle.current ?? item.title,
      };

      await saveItem(newItem);
    } else {
      // TODO: add validation
      addTodo({
        description: itemDescription.current ?? "",
        id: generateId().toString(),
        title: itemTitle.current ?? "",
      });
    }

    if (navigation.canGoBack()) navigation.goBack();
  };

  useEffect(() => {
    if (Platform.OS === "web") {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          navigation.goBack();
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, []);

  const title = taskId ? t("task.edit") : t("task.create");

  return (
    <ScreenWrapper disableLocaleChanger>
      <View style={styles.actions}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onSavePress}>
          <Text style={styles.saveText}>{t("task.save")}</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        editable
        defaultValue={item?.title ?? ""}
        onChangeText={onTitleChange}
        placeholder={t("home.input.taskTitle")}
        onSubmitEditing={() => {
          descriptionInput.current?.focus();
        }}
      />
      <View style={styles.editorWrapper}>
        <RichToolbar
          actions={supportedEditorActions}
          editor={textEditor}
          iconMap={actionsIcons}
          flatContainerStyle={
            Platform.OS === "web" && {
              width: "100%",
            }
          }
        />
        <ScrollView style={styles.fullHeight}>
          <RichEditor
            initialContentHTML={item?.description ?? ""}
            initialHeight={400}
            placeholder={t("home.input.taskDescription")}
            ref={textEditor}
            onChange={onDescriptionChange}
          />
        </ScrollView>
      </View>
      <Button
        label={t("task.save")}
        style={styles.saveButton}
        onPress={onSavePress}
      />
    </ScreenWrapper>
  );
};
