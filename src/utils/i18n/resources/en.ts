import type {ITranslation} from "../types";

export const englishTranslations: ITranslation = {
  alert: {
    cancel: "Cancel",
    delete: "Delete",
    enroll: "Enroll",
  },
  auth: {
    alert: {
      dataResetTitle: "Be careful",
      dateResetMessage:
        "If you continue with an existing account, all your data will be lost.",
      enterEmail: "Enter your email",
      forgotPassword: "Forgot your password?",
      passwordResetConfirmation: "Password reset email sent",
      passwordResetConfirmationMessage:
        "If an account exists with this email, you will receive an email with a link to reset your password.",
      socialAccountExists: "Account already exists",
      socialAccountExistsMessage: "Please sign in with {providers} instead.",
    },
    button: {
      default: "Next",
      existingUser: "Sign in",
      newUser: "Sign up",
    },
    continueWithoutAccount: "Continue without an account",
    error: {
      default: "Something went wrong, please try again",
      existingCredential:
        "Account already exists with a different social provider",
      invalidEmail: "Invalid email",
      networkError: "Network request failed",
      tooManyRequests: "Too many requests, please try again later",
      weakPassword: "Password is too weak",
      wrongPassword: "Check your email and password",
    },
    forgotPassword: "Forgot your password?",
    goBackButton: "Go back",
    inputs: {
      email: {
        placeholder: "Your email",
      },
      password: {
        placeholder: "Your password",
      },
    },
    privacy: {
      link: "Privacy Policy",
      title: "By continuing, you agree to our",
    },
    title: {
      default: "Let's get started",
      existingUser: "Welcome Back!",
      newUser: "Let's create your account",
    },
  },
  biometrics: {
    alert: {
      enroll: {
        message: "Do you want to lock your tasks with biometrics?",
        title: "Biometrics not enrolled",
      },
    },
    button: {
      enroll: "Enable {sensorType} Lock",
      lock: "Lock Tasks",
      unlock: "Unlock Tasks",
    },
  },
  home: {
    alert: {
      deleteTask: "Delete task?",
      deleteTaskConfirmation: "Are you sure you want to delete this task?",
    },
    doneTitle: "Done:",
    input: {
      taskDescription: "Task description",
      taskTitle: "Task title",
    },
    newTask: "Add a new task",
    title: "Ahoy!",
    todoTitle: "To Do:",
    welcome: "Welcome to TasksZen",
  },
  localeChange: "Language",
  menu: {
    alert: {
      deleteAccount: "Are you sure you want to delete your account?",
    },
    anonymous: "Anonymous:",
    connected: "Connected to Database:",
    createdAt: "Created at:",
    deleteAccount: "Delete Account",
    login: "Login",
    logout: "Logout",
    terms: "Terms of Service",
    title: "Menu",
  },
  task: {
    complete: "Complete Task",
    create: "Add a new task",
    delete: "Delete Task",
    edit: "Edit Task",
    locked: "This task is locked",
    save: "Save Task",
  },
};
