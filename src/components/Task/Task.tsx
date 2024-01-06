import {useState} from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {useTranslation} from "react-i18next";
import {Tooltip} from "@rneui/themed";
import {RichEditor} from "react-native-pell-rich-editor";

import {TooltipMenu} from "./TooltipMenu";

import {FONTS} from "../../constants/fonts";
import {COLORS} from "../../constants/colors";

import type {ITodoItem} from "../../types";

import {useAppearance} from "../../hooks/useAppearance";

interface TaskProps {
  item: ITodoItem;
  locked?: boolean;
  onComplete?: (id: string) => void;
  onDelete?: (id: string, done?: boolean) => void;
  onEdit?: (id: string) => void;
  onPress?: (id: string) => void;
  onRestore?: (id: string) => void;
}

export const Task = ({
  item,
  locked,
  onComplete,
  onDelete,
  onEdit,
  onPress,
  onRestore,
}: TaskProps) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const {description, done, id, title} = item;

  const {colors} = useAppearance();
  const iconColor = done ? COLORS.WHITE : colors.primaryInverse;

  const {t} = useTranslation();

  const styles = StyleSheet.create({
    container: {
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      maxHeight: 200,
      padding: 10,
    },
    containerDone: {
      backgroundColor: colors.notification,
    },
    containerLocked: {
      alignItems: "center",
      flexDirection: "row",
      height: 60,
      justifyContent: "center",
    },
    textDone: {
      color: COLORS.WHITE,
    },
    title: {
      color: colors.text,
      fontFamily: FONTS.POPPINS_BOLD,
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 0,
    },
    description: {
      color: colors.text,
      fontFamily: FONTS.POPPINS_REGULAR,
      fontSize: 14,
      fontWeight: "400",
    },
    textWrapper: {
      height: "100%",
      maxWidth: "90%",
      width: "100%",
    },
    icons: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 3,
      justifyContent: "flex-end",
      maxWidth: 45,
    },
    tooltipContainer: {
      borderColor: colors.border,
      borderRadius: 2,
      borderWidth: 1,
      padding: 0,
    },
  });

  const onCloseTooltip = () => {
    setTooltipOpen(false);
  };

  const onOpenTooltip = () => {
    setTooltipOpen(true);
  };

  const onCompleteTask = () => {
    onComplete?.(id);
  };

  const onDeleteTask = () => {
    onDelete?.(id);
  };

  const onEditTask = () => {
    onEdit?.(id);
    onCloseTooltip();
  };

  if (locked) {
    return (
      <View
        style={[
          styles.container,
          done ? styles.containerDone : {},
          locked ? styles.containerLocked : {},
        ]}>
        <Text style={styles.title}>{t("task.locked")}</Text>
      </View>
    );
  }

  const EditorWrapper = Platform.OS === "web" ? View : ScrollView;

  return (
    <TouchableOpacity
      disabled={locked ?? done}
      style={[styles.container, done ? styles.containerDone : {}]}
      onPress={() => {
        onPress?.(id);
      }}>
      <View style={styles.textWrapper}>
        <Text style={[styles.title, done ? styles.textDone : {}]}>{title}</Text>
        <EditorWrapper showsVerticalScrollIndicator={true}>
          <RichEditor
            key={description}
            disabled
            useContainer={Platform.OS !== "web"}
            editorStyle={{
              backgroundColor: "transparent",
              color: done ? COLORS.WHITE : colors.text,
            }}
            initialContentHTML={description}
          />
        </EditorWrapper>
      </View>
      <View style={styles.icons}>
        {!done && (
          <>
            <Tooltip
              backgroundColor={colors.link}
              containerStyle={styles.tooltipContainer}
              height={110}
              overlayColor={colors.overlay}
              popover={
                <TooltipMenu
                  onComplete={onCompleteTask}
                  onDelete={onDeleteTask}
                  onEdit={onEditTask}
                />
              }
              visible={tooltipOpen}
              withPointer={false}
              onClose={onCloseTooltip}
            />
            <TouchableOpacity onPress={onOpenTooltip}>
              <Icon color={iconColor} name="ellipsis-vertical" size={20} />
            </TouchableOpacity>
          </>
        )}
        {done ? (
          <>
            <TouchableOpacity onPress={() => onDelete?.(id, done)}>
              <Icon color={iconColor} name="trash-outline" size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onRestore?.(id);
              }}>
              <Icon color={iconColor} name="arrow-undo-outline" size={20} />
            </TouchableOpacity>
          </>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};
