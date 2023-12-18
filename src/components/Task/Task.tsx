import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import {FONTS} from "../../constants/fonts";
import {COLORS} from "../../constants/colors";

import type {ITodoItem} from "../../types";

import {useAppearance} from "../../hooks/useAppearance";

interface TaskProps {
  item: ITodoItem;
  onComplete?: (id: string) => void;
  onDelete?: (id: string, done?: boolean) => void;
  onRestore?: (id: string) => void;
}

export const Task = ({item, onComplete, onDelete, onRestore}: TaskProps) => {
  const {description, done, id, title} = item;

  const {colors} = useAppearance();
  const iconColor = done ? COLORS.WHITE : colors.primaryInverse;

  const styles = StyleSheet.create({
    container: {
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 10,
    },
    containerDone: {
      backgroundColor: colors.notification,
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
      maxWidth: "85%",
    },
    icons: {
      flexDirection: "row",
      gap: 8,
      width: 50,
    },
  });

  return (
    <View style={[styles.container, done ? styles.containerDone : {}]}>
      <View style={styles.textWrapper}>
        <Text style={[styles.title, done ? styles.textDone : {}]}>{title}</Text>
        <Text style={[styles.description, done ? styles.textDone : {}]}>
          {description}
        </Text>
      </View>
      <View style={styles.icons}>
        <TouchableOpacity onPress={() => onDelete?.(id, done)}>
          <Icon color={iconColor} name="trash-outline" size={20} />
        </TouchableOpacity>
        {onComplete ? (
          <TouchableOpacity
            onPress={() => {
              onComplete?.(id);
            }}>
            <Icon color={iconColor} name="checkmark-done-outline" size={20} />
          </TouchableOpacity>
        ) : null}
        {done ? (
          <TouchableOpacity
            onPress={() => {
              onRestore?.(id);
            }}>
            <Icon color={iconColor} name="arrow-undo-outline" size={20} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};
