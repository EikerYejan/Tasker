import {Platform, StyleSheet, View} from "react-native";
import {Dropdown} from "react-native-element-dropdown";
import Icon from "react-native-vector-icons/Ionicons";

import {useTranslation} from "react-i18next";
import {useAppearance} from "../hooks/useAppearance";
import {i18nService} from "../utils/i18n/i18nService";

import {FONTS} from "../constants/fonts";

import type {ILocale} from "../utils/i18n/types";

export const LocaleChanger = () => {
  const {colors} = useAppearance();
  const {i18n} = useTranslation();

  const onLocaleChange = (item: ILocale) => {
    i18n.changeLanguage(item.code);
  };

  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      flexDirection: "row",
      gap: 12,
      justifyContent: "center",
      paddingTop: 15,
      ...Platform.select({
        web: {
          marginBottom: 25,
        },
        default: {},
      }),
    },
    copyright: {
      color: colors.text,
      fontFamily: FONTS.POPPINS_BOLD,
      fontSize: 14,
      fontWeight: "bold",
    },
    pickerContainer: {
      borderColor: colors.border,
      borderWidth: 1,
      color: colors.text,
      fontFamily: FONTS.POPPINS_REGULAR,
      fontSize: 14,
      height: 30,
      minWidth: 120,
      paddingLeft: 5,
      ...Platform.select({
        web: {
          cursor: "pointer",
        },
        default: {},
      }),
    },
    pickerItemText: {
      color: colors.text,
      fontFamily: FONTS.POPPINS_REGULAR,
    },
    pickerItem: {
      backgroundColor: colors.background,
      color: colors.text,
    },
    leftIcon: {
      marginRight: 5,
    },
  });

  return (
    <View style={styles.container}>
      <Dropdown<ILocale>
        activeColor={colors.link}
        data={i18nService.supportedLocales}
        itemContainerStyle={styles.pickerItem}
        itemTextStyle={styles.pickerItemText}
        labelField="name"
        renderLeftIcon={() => (
          <Icon
            color={colors.text}
            name="language-outline"
            size={20}
            style={styles.leftIcon}
          />
        )}
        renderRightIcon={() => (
          <Icon color={colors.text} name="chevron-down-outline" size={20} />
        )}
        selectedTextStyle={styles.pickerItemText}
        style={styles.pickerContainer}
        value={i18n.language}
        valueField="code"
        onChange={onLocaleChange}
      />
    </View>
  );
};
