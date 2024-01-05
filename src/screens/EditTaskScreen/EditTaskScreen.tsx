import {StyleSheet, Text, View} from "react-native";
import {useMemo, useRef} from "react";
import {useNavigation} from "@react-navigation/native";
import {useTranslation} from "react-i18next";

import {ScreenWrapper} from "../../components/ScreenWrapper";
import {TextInput} from "../../components/TextInput/TextInput";
import {Button} from "../../components/Button/Button";

import {FONTS} from "../../constants/fonts";

import {useAppearance} from "../../hooks/useAppearance";
import {useAppState} from "../../store/store";

import type {TextInput as RNTextInput} from "react-native";

interface Props {
  taskId: string;
}

export const EditTaskScreen = ({taskId}: Props) => {
  const navigation = useNavigation();
  const {colors} = useAppearance();
  const {getItem, saveItem} = useAppState();

  const {t} = useTranslation();

  const item = useMemo(() => getItem(taskId), [taskId]);

  const itemTitle = useRef(item?.title);
  const itemDescription = useRef(item?.description);

  const descriptionInput = useRef<RNTextInput>(null);

  const styles = StyleSheet.create({
    descriptiom: {
      marginTop: 15,
    },
    saveButton: {
      marginTop: 40,
    },
    textArea: {
      height: 200,
    },
    title: {
      color: colors.text,
      fontFamily: FONTS.POPPINS_BOLD,
      fontSize: 24,
      marginBottom: 15,
    },
  });

  const onTitleChange = (text: string) => {
    itemTitle.current = text;
  };

  const onDescriptionChange = (text: string) => {
    itemDescription.current = text;
  };

  const onSavePress = async () => {
    if (!item) return;

    const newItem = {
      ...item,
      description: itemDescription.current ?? item?.description,
      title: itemTitle.current ?? item.title,
    };

    await saveItem(newItem);

    if (navigation.canGoBack()) navigation.goBack();
  };

  if (!item) return null;

  return (
    <ScreenWrapper disableLocaleChanger>
      <View>
        <Text style={styles.title}>{t("task.edit")}</Text>
        <TextInput
          editable
          defaultValue={item.title}
          onChangeText={onTitleChange}
          onSubmitEditing={() => {
            descriptionInput.current?.focus();
          }}
        />
        <TextInput
          editable
          multiline
          defaultValue={item.description}
          ref={descriptionInput}
          style={[styles.descriptiom, styles.textArea]}
          onChangeText={onDescriptionChange}
        />
        <Button
          label={t("task.save")}
          style={styles.saveButton}
          onPress={onSavePress}
        />
      </View>
    </ScreenWrapper>
  );
};
