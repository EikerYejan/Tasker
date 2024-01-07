import {Platform, StyleSheet} from "react-native";

import {FONTS} from "../../constants/fonts";

import type {Theme} from "@react-navigation/native";

export const getStyles = (theme: Theme) => {
  const {colors} = theme;

  return StyleSheet.create({
    pageTitle: {
      color: colors.text,
      fontFamily: FONTS.POPPINS_BOLD,
      fontSize: 45,
      fontWeight: "700",
      lineHeight: 50,
    },
    contentGrid: {
      gap: 20,
    },
    contentGridTablet: {
      flexDirection: "row",
      flexWrap: "nowrap",
      gap: 60,
      justifyContent: "space-between",
    },
    contentRow: {
      width: "100%",
    },
    contentRowTablet: {
      flex: 1,
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
    lockButtonText: {
      color: colors.link,
      fontFamily: FONTS.POPPINS_MEDIUM,
      fontSize: 14,
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
    todoSectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      flexWrap: "nowrap",
    },
    todoSectionActions: {
      alignItems: "center",
      flexDirection: "row",
      flexWrap: "nowrap",
      justifyContent: "space-between",
      width: 70,
    },
  });
};
