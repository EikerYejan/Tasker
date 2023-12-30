import {StyleSheet} from "react-native";
import {FONTS} from "../../constants/fonts";
import {COLORS} from "../../constants/colors";

export const authScreenStyles = StyleSheet.create({
  inner: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "auto",
    maxWidth: 450,
    padding: 20,
    width: "100%",
    height: "100%",
  },
  error: {
    color: COLORS.RED,
    fontFamily: FONTS.POPPINS_BOLD,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  heading: {
    fontFamily: FONTS.POPPINS_BOLD,
    fontSize: 36,
    fontWeight: "700",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    marginBottom: 15,
    marginLeft: "auto",
    marginRight: "auto",
    width: "80%",
  },
  button: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 15,
  },
  continueWithoutAccountText: {
    fontFamily: FONTS.POPPINS_REGULAR,
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 20,
    marginTop: 10,
    textAlign: "center",
  },
  termsButton: {
    fontSize: 12,
    marginTop: "auto",
  },
  termsLink: {
    color: COLORS.LINK,
    fontFamily: FONTS.POPPINS_BOLD,
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
    zIndex: 1,
    right: 0,
    top: 0,
  },
  socialAuthWrapper: {
    marginBottom: 15,
    marginTop: 10,
    flexDirection: "row",
    gap: 15,
  },
});
