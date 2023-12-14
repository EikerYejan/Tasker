import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { FONTS } from "../../constants/fonts";
import { COLORS } from "../../constants/colors";

import type { ITodoItem } from "../../store/store";

interface TaskProps {
  item: ITodoItem;
  onComplete?: (id: string) => void;
  onDelete?: (id: string, done?: boolean) => void;
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
});

export const Task = ({ item, onComplete, onDelete }: TaskProps) => {
  const { description, done, id, title } = item;

  return (
    <View style={[styles.container, done ? styles.containerDone : {}]}>
      <View>
        <Text style={[styles.title, done ? styles.textDone : {}]}>{title}</Text>
        <Text style={[styles.description, done ? styles.textDone : {}]}>
          {description}
        </Text>
      </View>
      <View>
        <TouchableOpacity onPress={() => onDelete?.(id, true)}>
          <Text>Delete</Text>
        </TouchableOpacity>
        {onComplete ? (
          <TouchableOpacity onPress={() => onComplete?.(id)}>
            <Text>Done</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};
