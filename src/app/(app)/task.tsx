import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {useEffect, useMemo, useRef} from "react";
import {RichEditor, RichToolbar} from "react-native-pell-rich-editor";
import {router, useLocalSearchParams} from "expo-router";
import {useTranslation} from "react-i18next";
import {useMediaQuery} from "react-responsive";
import Icon from "react-native-vector-icons/Ionicons";

import {ScreenWrapper} from "../../components/ScreenWrapper";
import {TextInput} from "../../components/TextInput/TextInput";
import {Button} from "../../components/Button/Button";

import {FONTS} from "../../constants/fonts";
import {TABLET_WIDTH} from "../../constants/mediaQueries";
import {actionsIcons, supportedEditorActions} from "../../constants/editor";

import {useAppearance} from "../../hooks/useAppearance";
import {useAppState} from "../../store/store";
import {generateId} from "../../utils";

import type {TextInput as RNTextInput} from "react-native";

export default function TaskScreen() {
  const {taskId} = useLocalSearchParams<{
    taskId?: string;
  }>();

  const {colors} = useAppearance();
  const {addTodo, getItem, saveItem} = useAppState();

  const {t} = useTranslation();

  const item = useMemo(() => (taskId ? getItem(taskId) : null), [taskId]);

  const itemTitle = useRef(item?.title);
  const itemDescription = useRef(item?.description);

  const descriptionInput = useRef<RNTextInput>(null);

  const textEditor = useRef<RichEditor>(null);

  const isTablet = useMediaQuery({minWidth: TABLET_WIDTH});

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
    screenWrapper: {
      ...(Platform.OS === "web"
        ? {
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
          }
        : {}),
    },
    contentContainer: {
      ...(Platform.OS === "web"
        ? {
            backgroundColor: colors.background,
            borderRadius: 10,
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            height: "100%",
            marginBottom: "auto",
            marginTop: "auto",
            maxHeight: isTablet ? "80%" : "100%",
            maxWidth: 960,
            width: "100%",
          }
        : {}),
    },
  });

  const onTitleChange = (text: string) => {
    itemTitle.current = text;
  };

  const onDescriptionChange = (text: string) => {
    itemDescription.current = text;
  };

  const onClose = () => {
    if (router.canGoBack()) router.back();
    else router.push("/");
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

    onClose();
  };

  useEffect(() => {
    if (Platform.OS === "web") {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, []);

  const title = taskId ? t("task.edit") : t("task.create");
  const isWeb = Platform.OS === "web";

  return (
    <ScreenWrapper
      disableLocaleChanger
      contentContainerStyle={styles.contentContainer}
      style={styles.screenWrapper}>
      <View style={styles.actions}>
        <Text style={styles.title}>{title}</Text>
        {isWeb ? (
          <TouchableOpacity onPress={onClose}>
            <Icon name="close-outline" size={35} color={colors.text} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onSavePress}>
            <Text style={styles.saveText}>{t("task.save")}</Text>
          </TouchableOpacity>
        )}
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
}
