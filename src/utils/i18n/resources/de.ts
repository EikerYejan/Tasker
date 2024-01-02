import type {ITranslation} from "../types";

export const germanTranslations: ITranslation = {
  alert: {
    cancel: "Abbrechen",
    delete: "Löschen",
    enroll: "Registrieren",
  },
  auth: {
    alert: {
      dataResetTitle: "Sei vorsichtig",
      dateResetMessage:
        "Wenn du mit einem bestehenden Konto fortfährst, gehen alle deine Daten verloren.",
      enterEmail: "Gib deine E-Mail ein",
      forgotPassword: "Passwort vergessen?",
      passwordResetConfirmation: "Passwort zurücksetzen E-Mail gesendet",
      passwordResetConfirmationMessage:
        "Wenn ein Konto mit dieser E-Mail existiert, erhältst du eine E-Mail mit einem Link zum Zurücksetzen deines Passworts.",
      socialAccountExists: "Konto existiert bereits",
      socialAccountExistsMessage:
        "Bitte melde dich stattdessen mit {providers} an.",
    },
    button: {
      default: "Weiter",
      existingUser: "Anmelden",
      newUser: "Registrieren",
    },
    continueWithoutAccount: "Ohne Konto fortfahren",
    error: {
      default: "Etwas ist schiefgegangen, bitte versuche es erneut",
      existingCredential:
        "Konto existiert bereits mit einem anderen Social Provider",
      invalidEmail: "Ungültige E-Mail",
      networkError: "Netzwerkfehler, bitte versuche es erneut",
      tooManyRequests: "Zu viele Anfragen, bitte versuche es später erneut",
      weakPassword: "Das Passwort ist zu schwach",
      wrongPassword: "Überprüfe deine E-Mail und dein Passwort",
    },
    forgotPassword: "Passwort vergessen?",
    goBackButton: "Zurück",
    inputs: {
      email: {
        placeholder: "Deine E-Mail",
      },
      password: {
        placeholder: "Dein Passwort",
      },
    },
    privacy: {
      link: "Datenschutzrichtlinie",
      title: "Durch die Fortsetzung stimmst du unseren",
    },
    title: {
      default: "Lass uns loslegen",
      existingUser: "Willkommen zurück!",
      newUser: "Erstelle dein Konto",
    },
  },
  biometrics: {
    alert: {
      enroll: {
        message: "Möchtest du deine Aufgaben mit Biometrie sperren?",
        title: "Biometrie nicht registriert",
      },
    },
    button: {
      enroll: "{sensorType} Sperre aktivieren",
      lock: "Aufgaben sperren",
      unlock: "Aufgaben entsperren",
    },
  },
  localeChange: "Sprache",
  home: {
    alert: {
      deleteTask: "Aufgabe löschen?",
      deleteTaskConfirmation:
        "Bist du sicher, dass du diese Aufgabe löschen möchtest?",
    },
    button: {
      saveTask: "Speichern",
    },
    doneTitle: "Erledigt:",
    input: {
      taskDescription: "Aufgabenbeschreibung",
      taskTitle: "Aufgabentitel",
    },
    newTask: "Neue Aufgabe hinzufügen",
    title: "Ahoy!",
    todoTitle: "Ausstehend:",
    welcome: "Willkommen bei TasksZen",
  },
  menu: {
    alert: {
      deleteAccount: "Bist du sicher, dass du dein Konto löschen möchtest?",
    },
    anonymous: "Anonym:",
    connected: "Verbunden mit der Datenbank:",
    createdAt: "Erstellt am:",
    deleteAccount: "Konto löschen",
    login: "Anmelden",
    logout: "Abmelden",
    terms: "Nutzungsbedingungen",
    title: "Menü",
  },
  task: {
    locked: "Diese Aufgabe ist gesperrt",
  },
};
