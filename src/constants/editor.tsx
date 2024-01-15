import {Text} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {FONTS} from "./fonts";

export const supportedEditorActions = [
  "undo",
  "redo",
  "keyboard",
  "bold",
  "italic",
  "underline",
  "heading1",
  "heading2",
  "heading3",
  "line",
  "paragraph",
  "removeFormat",
  "unorderedList",
  "orderedList",
  "link",
  "fontSize",
  "subscript",
  "superscript",
  "strikeThrough",
  "indent",
  "outdent",
  "code",
  "quote",
] as const;

const headingStyles = {fontFamily: FONTS.POPPINS_REGULAR, fontSize: 18};

export const actionsIcons = {
  heading1: () => <Text style={headingStyles}>H1</Text>,
  heading2: () => <Text style={headingStyles}>H2</Text>,
  heading3: () => <Text style={headingStyles}>H3</Text>,
  paragraph: () => <Icon name="text-outline" size={20} />,
};
