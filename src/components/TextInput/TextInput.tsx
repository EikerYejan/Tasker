import {
  StyleSheet,
  TextInput as RNTextInput,
  type TextInputProps,
  View,
  TouchableOpacity,
} from "react-native";
import {forwardRef, useState} from "react";
import Icon from "react-native-vector-icons/Ionicons";

import {FONTS} from "../../constants/fonts";

import {useAppearance} from "../../hooks/useAppearance";

export const TextInput = forwardRef<RNTextInput, TextInputProps>(
  function TextInputWithRef({style, secureTextEntry, ...props}, ref) {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const onPasswordIconPress = () => {
      setPasswordVisible(!passwordVisible);
    };

    const {colors} = useAppearance();

    const styles = StyleSheet.create({
      container: {
        width: "100%",
      },
      passwordIcon: {
        position: "absolute",
        right: 10,
        top: 6,
      },
      input: {
        borderColor: colors.primaryInverse,
        borderWidth: 1,
        color: colors.text,
        fontFamily: FONTS.POPPINS_REGULAR,
        minHeight: 40,
        padding: 10,
        width: "100%",
      },
    });

    console.log();

    return (
      <View style={[styles.container, style]}>
        <RNTextInput
          {...props}
          ref={ref}
          secureTextEntry={!!(secureTextEntry && !passwordVisible)}
          style={styles.input}
          placeholderTextColor={colors.text}
        />
        {secureTextEntry ? (
          <TouchableOpacity
            style={styles.passwordIcon}
            onPress={onPasswordIconPress}>
            <Icon
              name={!passwordVisible ? "eye-outline" : "eye-off-outline"}
              size={25}
              color={colors.text}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  },
);
