import {NativeModules, Platform} from "react-native";
import i18n from "i18next";
import {initReactI18next} from "react-i18next";

import {englishTranslations} from "./resources/en";
import {spanishTranslations} from "./resources/es";
import {germanTranslations} from "./resources/de";
import {storage} from "../../store/store";

import type {ILocale} from "./types";

const {I18nManager, SettingsManager} = NativeModules;

class I18nServiceBase {
  private isInitialized = false;

  private storageKey = "locale";

  private parseLocale(locale?: string): string {
    if (!locale) return "en";

    return locale.replace("_", "-").split("-")?.[0];
  }

  get supportedLocales(): ILocale[] {
    return [
      {code: "en", name: "English"},
      {code: "es", name: "Español"},
      {code: "de", name: "Deutsch"},
    ];
  }

  get locale(): string | undefined {
    const storedLocale = storage.getString(this.storageKey);

    if (storedLocale) return storedLocale;

    return this.parseLocale(
      Platform.select<string>({
        web: navigator.language ?? navigator.languages?.[0],
        ios:
          SettingsManager?.settings?.AppleLocale ??
          SettingsManager?.settings?.AppleLanguages?.[0],
        android: I18nManager?.localeIdentifier,
      }),
    );
  }

  saveLocale(locale: string) {
    storage.set(this.storageKey, this.parseLocale(locale));
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

  async init() {
    if (this.isInitialized) return;

    await i18n.use(initReactI18next).init({
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
        de: {
          translation: germanTranslations,
        },
      },
    });

    this.isInitialized = true;

    i18n.on("languageChanged", lng => {
      this.saveLocale(lng);
    });
  }
}

export const i18nService = new I18nServiceBase();
