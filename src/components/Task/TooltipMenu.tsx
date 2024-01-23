import {TouchableOpacity, Text, View, StyleSheet} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {useTranslation} from "react-i18next";

import {FONTS} from "../../constants/fonts";
import {COLORS} from "../../constants/colors";

interface TooltipMenuProps {
  onComplete?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  option: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    gap: 6,
    justifyContent: "flex-start",
    paddingLeft: 10,
  },
  optionText: {
    color: COLORS.WHITE,
    fontFamily: FONTS.POPPINS_MEDIUM,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});

export const TooltipMenu = ({
  onComplete,
  onDelete,
  onEdit,
}: TooltipMenuProps) => {
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      {onComplete && (
        <TouchableOpacity
          id="menuCompleteTask"
          style={styles.option}
          onPress={onComplete}>
          <Icon color={COLORS.WHITE} name="checkbox-outline" size={20} />
          <Text style={styles.optionText}>{t("task.complete")}</Text>
        </TouchableOpacity>
      )}
      {onEdit && (
        <TouchableOpacity
          id="menuEditTask"
          style={styles.option}
          onPress={onEdit}>
          <Icon color={COLORS.WHITE} name="create-outline" size={20} />
          <Text style={styles.optionText}>{t("task.edit")}</Text>
        </TouchableOpacity>
      )}
      {onDelete && (
        <TouchableOpacity
          id="menuDeleteTask"
          style={styles.option}
          onPress={onDelete}>
          <Icon color={COLORS.WHITE} name="trash-outline" size={20} />
          <Text style={styles.optionText}>{t("task.delete")}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
