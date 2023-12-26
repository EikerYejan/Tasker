import type {AlertButton} from "react-native";

import {FONTS} from "../../constants/fonts";
import {COLORS} from "../../constants/colors";

type CallbackOrButtons = ((text: string) => void) | AlertButton[];

const dialogStyles = {
  button: {
    "background-color": "transparent",
    "font-family": FONTS.POPPINS_REGULAR,
    "font-size": 16,
    "font-weight": "bold",
    "margin-bottom": 10,
    "margin-top": 0,
    border: `1px solid currentColor`,
    color: "inherit",
    cursor: "pointer",
    height: 36,
    padding: "5px 17px",
    width: "100%",
  },
  closeButton: {
    "background-color": "transparent",
    "font-family": FONTS.POPPINS_BOLD,
    "font-size": 22,
    "font-weight": "bold",
    border: "none",
    color: "inherit",
    cursor: "pointer",
    padding: 0,
    position: "absolute",
    right: 20,
    top: 10,
  },
  destructiveButton: {
    color: COLORS.RED,
  },
  dialog: {
    "background-color": "inherit",
    "border-radius": 8,
    "flex-direction": "column",
    "flex-wrap": "wrap",
    "min-height": 225,
    border: "none",
    color: "inherit",
    display: "flex",
    padding: "20px 20px 10px",
    width: 295,
  },
  message: {
    "font-family": FONTS.POPPINS_REGULAR,
    "font-size": 16,
    "font-weight": "normal",
    "margin-top": 0,
    "margin-bottom": 15,
  },
  prompt: {
    "font-family": FONTS.POPPINS_REGULAR,
    "font-size": 16,
    "font-weight": "normal",
    "margin-bottom": 30,
    "margin-top": 10,
    padding: "5px 17px",
    width: 255,
  },
  title: {
    "font-family": FONTS.POPPINS_BOLD,
    "font-size": 24,
    "font-weight": "bold",
    "line-height": 24,
    "margin-bottom": 5,
    "margin-top": 0,
    "max-width": "80%",
  },
};

class AlertBase {
  private promptValue: string | undefined = undefined;

  private toHTMLStyles(styles: Record<string, string | number>) {
    return Object.entries(styles)
      .map(
        ([key, value]) =>
          `${key}:  ${typeof value === "string" ? value : `${value}px`}`,
      )
      .join(";");
  }

  private getDOMRoot() {
    const id = "dialog-root";

    return document.getElementById(id) as HTMLDivElement;
  }

  private createCloseButton() {
    const button = document.createElement("button");

    button.textContent = "x";
    button.setAttribute("style", this.toHTMLStyles(dialogStyles.closeButton));
    button.onclick = () => {
      if (button.parentElement) {
        this.closeDialogElement(button.parentElement as HTMLDialogElement);
      }
    };

    return button;
  }

  private createDialogButtons(
    buttons: AlertButton[],
    dialog: HTMLDialogElement,
  ) {
    const wrapper = dialog.appendChild(document.createElement("div"));

    wrapper.setAttribute("style", this.toHTMLStyles({"margin-top": "auto"}));

    buttons.forEach(button => {
      const buttonElement = wrapper.appendChild(
        document.createElement("button"),
      );

      buttonElement.textContent = button.text ?? "";
      buttonElement.setAttribute(
        "style",
        this.toHTMLStyles({
          ...dialogStyles.button,
          ...(button.style === "destructive"
            ? dialogStyles.destructiveButton
            : {}),
        }),
      );
      buttonElement.onclick = () => {
        button.onPress?.(this.promptValue);
        this.closeDialogElement(dialog);
      };
    });
  }

  private createDialogElement({
    callbackOrButtons,
    message,
    prompt,
    title,
  }: {
    callbackOrButtons?: CallbackOrButtons;
    message?: string;
    prompt?: boolean;
    title: string;
  }) {
    const root = this.getDOMRoot();
    const dialog = root.appendChild(document.createElement("dialog"));
    const alertButtons = Array.isArray(callbackOrButtons)
      ? callbackOrButtons
      : ([
          {
            onPress: callbackOrButtons,
            text: "OK",
          },
        ] as AlertButton[]);

    dialog.appendChild(this.createCloseButton());
    dialog.setAttribute("style", this.toHTMLStyles(dialogStyles.dialog));

    const titleElement = dialog.appendChild(document.createElement("h3"));

    titleElement.textContent = title;
    titleElement.setAttribute("style", this.toHTMLStyles(dialogStyles.title));

    if (message) {
      const meessageElement = dialog.appendChild(document.createElement("p"));

      meessageElement.textContent = message;
      meessageElement.setAttribute(
        "style",
        this.toHTMLStyles(dialogStyles.message),
      );

      dialog.appendChild(meessageElement);
    }

    if (prompt) {
      const input = dialog.appendChild(document.createElement("input"));

      input.setAttribute("type", "text");
      input.setAttribute("style", this.toHTMLStyles(dialogStyles.prompt));

      input.oninput = event => {
        this.promptValue = (event.target as HTMLInputElement).value;
      };
    }

    this.createDialogButtons(alertButtons, dialog);

    dialog.onclose = () => {
      dialog.remove();
      this.promptValue = undefined;
    };

    return dialog;
  }

  private closeDialogElement(dialog: HTMLDialogElement) {
    dialog.close();
    dialog.remove();

    this.promptValue = undefined;
  }

  alert(title: string, message?: string, buttons?: AlertButton[]) {
    const dialog = this.createDialogElement({
      callbackOrButtons: buttons,
      message,
      prompt: false,
      title,
    });

    dialog.showModal();
  }

  prompt(
    title: string,
    message?: string,
    callbackOrButtons?: CallbackOrButtons,
  ) {
    const dialog = this.createDialogElement({
      callbackOrButtons,
      message,
      prompt: true,
      title,
    });

    dialog.showModal();
  }
}

export const Alert = new AlertBase();
