import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { FONTS } from "../../constants/fonts";
import { COLORS } from "../../constants/colors";

import type { ITodoItem } from "../../store/store";

interface TaskProps {
  item: ITodoItem;
  onComplete?: (id: string) => void;
  onDelete?: (id: string, done?: boolean) => void;
  onRestore?: (id: string) => void;
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: COLORS.BLACK,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  containerDone: {
    backgroundColor: COLORS.GREEN,
  },
  textDone: {
    color: COLORS.WHITE,
  },
  title: {
    fontFamily: FONTS.POPPINS_BOLD,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 0,
  },
  description: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: FONTS.POPPINS_REGULAR,
  },
  icons: {
    flexDirection: "row",
    gap: 8,
  },
});

export const Task = ({ item, onComplete, onDelete, onRestore }: TaskProps) => {
  const { description, done, id, title } = item;

  const iconColor = done ? COLORS.WHITE : COLORS.BLACK;

  return (
    <View style={[styles.container, done ? styles.containerDone : {}]}>
      <View>
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
          <TouchableOpacity onPress={() => onComplete?.(id)}>
            <Icon color={iconColor} name="checkmark-done-outline" size={20} />
          </TouchableOpacity>
        ) : null}
        {done ? (
          <TouchableOpacity onPress={() => onRestore?.(id)}>
            <Icon color={iconColor} name="arrow-undo-outline" size={20} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};
