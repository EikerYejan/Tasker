import {NativeModules, Platform} from "react-native";
import i18n from "i18next";
import {initReactI18next} from "react-i18next";

import {englishTranslations} from "./resources/en";
import {spanishTranslations} from "./resources/es";

const {I18nManager, SettingsManager} = NativeModules;

class I18nServiceBase {
  private isInitialized = false;

  private parseLocale(locale?: string): string {
    if (!locale) return "en-US";

    return locale.replace("_", "-");
  }

  get locale(): string | undefined {
    return Platform.select({
      web: navigator.language,
      ios:
        SettingsManager?.settings?.AppleLocale ??
        SettingsManager?.settings?.AppleLanguages?.[0],
      android: I18nManager?.localeIdentifier,
    });
  }

  parseDate(
    date: string | number,
    options?: Intl.DateTimeFormatOptions,
  ): string {
    return new Date(date).toLocaleDateString(
      this.parseLocale(this.locale),
      options,
    );
  }

  init() {
    if (this.isInitialized) return;

    return i18n
      .use(initReactI18next)
      .init({
        compatibilityJSON: "v3",
        debug: true,
        lng: this.locale,
        fallbackLng: "en",
        load: "all",
        interpolation: {
          escapeValue: false,
        },
        resources: {
          en: {
            translation: englishTranslations,
          },
          es: {
            translation: spanishTranslations,
          },
        },
      })
      .then(() => {
        this.isInitialized = true;
      });
  }
}

export const i18nService = new I18nServiceBase();
