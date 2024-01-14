import {useState} from "react";
import {Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
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
      maxHeight: Platform.select({
        web: 100,
        native: 250,
      }),
      padding: 10,
      width: "100%",
      overflow: "hidden",
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
      overflow: "hidden",
      width: "100%",
    },
    icons: {
      flexDirection: "row",
      height: 25,
      justifyContent: "space-between",
      maxWidth: 50,
      width: "10%",
    },
    tooltipContainer: {
      borderColor: colors.border,
      borderRadius: 2,
      borderWidth: 1,
      padding: 0,
    },
    webEditorMask: {
      height: "100%",
      position: "absolute",
      width: "100%",
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

  return (
    <TouchableOpacity
      disabled={locked ?? done}
      style={[styles.container, done ? styles.containerDone : {}]}
      onPress={() => {
        onPress?.(id);
      }}>
      <View style={styles.textWrapper}>
        <Text style={[styles.title, done ? styles.textDone : {}]}>{title}</Text>
        <View>
          {Platform.OS === "web" && (
            <TouchableOpacity
              id="webEditorMask"
              style={styles.webEditorMask}
              onPress={() => {
                onPress?.(id);
              }}
            />
          )}
          <RichEditor
            key={description}
            disabled
            useContainer={Platform.OS !== "web"}
            editorStyle={{
              backgroundColor: "transparent",
              color: done ? COLORS.WHITE : colors.text,
              initialCSSText: `#content { overflow: hidden; }`,
            }}
            initialContentHTML={description}
          />
        </View>
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
              width={130}
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
