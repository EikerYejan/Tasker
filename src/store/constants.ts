import {Appearance} from "react-native";

import {i18nService} from "../utils/i18n/i18nService";

import type {IAppStore} from "../types";

const defaultItemsByLocale = {
  en: {
    todos: [
      {
        description: "Here you can add a description",
        done: false,
        id: "2",
        title: "This is a todo item",
      },
    ],
    done: [
      {
        description: "Here you can see what you have done",
        done: true,
        id: "1",
        title: "This is a done item",
      },
    ],
  },
  es: {
    todos: [
      {
        description: "Aquí puedes agregar una descripción",
        done: false,
        id: "2",
        title: "Este es un elemento por hacer",
      },
    ],
    done: [
      {
        description: "Aquí puedes ver lo que has hecho",
        done: true,
        id: "1",
        title: "Este es un elemento hecho",
      },
    ],
  },
  de: {
    todos: [
      {
        description: "Hier können Sie eine Beschreibung hinzufügen",
        done: false,
        id: "2",
        title: "Dies ist ein Todo-Element",
      },
    ],
    done: [
      {
        description: "Hier können Sie sehen, was Sie getan haben",
        done: true,
        id: "1",
        title: "Dies ist ein erledigtes Element",
      },
    ],
  },
};

export const getInitialState = () => {
  const userLocale = i18nService.locale;
  const defaultItems =
    defaultItemsByLocale[userLocale as keyof typeof defaultItemsByLocale];
  const defaulApptState: IAppStore = {
    theme: {
      setByUser: false,
      value: Appearance.getColorScheme(),
    },
    ...defaultItems,
  };

  return defaulApptState;
};
