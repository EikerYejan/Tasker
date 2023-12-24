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

interface Props extends TextInputProps {
  disabled?: boolean;
}

export const TextInput = forwardRef<RNTextInput, Props>(
  function TextInputWithRef(
    {disabled = false, style, secureTextEntry, ...props},
    ref,
  ) {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const onPasswordIconPress = () => {
      setPasswordVisible(!passwordVisible);
    };

    const {colors} = useAppearance();

    const styles = StyleSheet.create({
      container: {
        width: "100%",
        height: 40,
      },
      disabledContainer: {
        opacity: 0.5,
        pointerEvents: "none",
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
        padding: 10,
        width: "100%",
        height: "100%",
      },
    });

    return (
      <View
        aria-disabled={disabled}
        style={[
          styles.container,
          style,
          disabled ? styles.disabledContainer : {},
        ]}>
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
