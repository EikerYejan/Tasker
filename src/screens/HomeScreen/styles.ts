import { Platform, StyleSheet } from "react-native";
import { Theme } from "@react-navigation/native";

import { FONTS } from "../../constants/fonts";

export const getStyles = (theme: Theme) => {
  const { colors } = theme;

  return StyleSheet.create({
    pageTitle: {
      color: colors.text,
      fontFamily: FONTS.POPPINS_BOLD,
      fontSize: 45,
      fontWeight: "700",
      lineHeight: 50,
    },
    contentGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 60,
      justifyContent: "space-between",
    },
    contentGridTablet: {
      flexWrap: "nowrap",
    },
    contentRow: {
      width: "100%",
    },
    contentRowTablet: {
      maxWidth: "50%",
      width: "50%",
    },
    pageDescription: {
      color: colors.text,
      fontFamily: FONTS.POPPINS_REGULAR,
      fontSize: 16,
      fontWeight: "400",
      marginBottom: 30,
    },
    sectionHeading: {
      color: colors.text,
      fontFamily: FONTS.POPPINS_BOLD,
      fontSize: 24,
      fontWeight: "700",
      marginBottom: 12,
    },
    input: {
      marginBottom: 16,
    },
    textArea: {
      height: 100,
    },
    tasksWrapper: {
      borderBottomWidth: 0,
      borderColor: colors.border,
      borderWidth: 1,
    },
    sectionContainer: {
      marginBottom: 18,
    },
    page: {
      ...(Platform.OS === "web"
        ? {
            marginLeft: "auto",
            marginRight: "auto",
            maxWidth: 1420,
            width: "100%",
          }
        : {}),
    },
  });
};
