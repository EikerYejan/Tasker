export interface ITranslation {
  auth: {
    title: {
      default: string;
      existingUser: string;
      newUser: string;
    };
    button: {
      default: string;
      existingUser: string;
      newUser: string;
    };
    error: {
      default: string;
      existingCredential: string;
      invalidEmail: string;
      networkError: string;
      tooManyRequests: string;
      weakPassword: string;
      wrongPassword: string;
    };
    inputs: {
      email: {
        placeholder: string;
      };
      password: {
        placeholder: string;
      };
    };
    privacy: {
      title: string;
      link: string;
    };
    alert: {
      dataResetTitle: string;
      dateResetMessage: string;
      enterEmail: string;
      forgotPassword: string;
      passwordResetConfirmation: string;
      passwordResetConfirmationMessage: string;
      socialAccountExists: string;
      socialAccountExistsMessage: string;
    };
    goBackButton: string;
    continueWithoutAccount: string;
    forgotPassword: string;
  };
  alert: {
    cancel: string;
    delete: string;
    enroll: string;
  };
  biometrics: {
    alert: {
      enroll: {
        title: string;
        message: string;
      };
    };
    button: {
      enroll: string;
      lock: string;
      unlock: string;
    };
  };
  home: {
    alert: {
      deleteTask: string;
      deleteTaskConfirmation: string;
    };
    title: string;
    welcome: string;
    input: {
      taskTitle: string;
      taskDescription: string;
    };
    newTask: string;
    todoTitle: string;
    doneTitle: string;
  };
  localeChange: string;
  menu: {
    alert: {deleteAccount: string};
    anonymous: string;
    connected: string;
    createdAt: string;
    deleteAccount: string;
    login: string;
    logout: string;
    terms: string;
    title: string;
  };
  task: {
    complete: string;
    create: string;
    delete: string;
    edit: string;
    locked: string;
    save: string;
  };
}

export interface ILocale {
  code: string;
  name: string;
}
