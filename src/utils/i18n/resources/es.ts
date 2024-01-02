import type {ITranslation} from "../types";

export const spanishTranslations: ITranslation = {
  auth: {
    title: {
      default: "¡Comencemos!",
      existingUser: "¡Bienvenido de nuevo!",
      newUser: "¡Crea tu cuenta!",
    },
    button: {
      default: "Siguiente",
      existingUser: "Iniciar sesión",
      newUser: "Registrarse",
    },
    error: {
      default: "Algo salió mal, por favor intenta de nuevo",
      existingCredential:
        "Ya existe una cuenta con otro proveedor de redes sociales",
      invalidEmail: "Correo electrónico inválido",
      networkError: "Error de red, por favor inténtalo de nuevo",
      tooManyRequests: "Demasiadas solicitudes, por favor inténtalo más tarde",
      weakPassword: "La contraseña es demasiado débil",
      wrongPassword: "Verifica tu correo electrónico y contraseña",
    },
    inputs: {
      email: {
        placeholder: "Tu correo electrónico",
      },
      password: {
        placeholder: "Tu contraseña",
      },
    },
    privacy: {
      title: "Al continuar, aceptas nuestra",
      link: "Política de Privacidad",
    },
    alert: {
      dataResetTitle: "Ten cuidado",
      dateResetMessage:
        "Si continúas con una cuenta existente, perderás todos tus datos.",
      enterEmail: "Ingresa tu correo electrónico",
      forgotPassword: "¿Olvidaste tu contraseña?",
      passwordResetConfirmation:
        "Se ha enviado un correo para restablecer tu contraseña",
      passwordResetConfirmationMessage:
        "Si existe una cuenta asociada a este correo electrónico, recibirás un mensaje con un enlace para restablecer tu contraseña.",
      socialAccountExists: "La cuenta ya existe",
      socialAccountExistsMessage:
        "Por favor, inicia sesión con {providers} en su lugar.",
    },
    goBackButton: "Volver",
    continueWithoutAccount: "Continuar sin una cuenta",
    forgotPassword: "¿Olvidaste tu contraseña?",
  },
  alert: {
    cancel: "Cancelar",
    delete: "Eliminar",
    enroll: "Activar",
  },
  home: {
    alert: {
      deleteTask: "¿Eliminar tarea?",
      deleteTaskConfirmation:
        "¿Estás seguro de que deseas eliminar esta tarea?",
    },
    title: "¡Hola!",
    welcome: "Bienvenido a TasksZen",
    input: {
      taskTitle: "Título de la tarea",
      taskDescription: "Descripción de la tarea",
    },
    newTask: "Crea una nueva tarea",
    button: {
      saveTask: "Guardar",
    },
    todoTitle: "Por hacer:",
    doneTitle: "Hecho:",
  },
  biometrics: {
    alert: {
      enroll: {
        title: "Biometría no registrada",
        message: "¿Deseas bloquear tus tareas con biometría?",
      },
    },
    button: {
      enroll: "Bloquear con {sensorType}",
      lock: "Bloquear con {sensorType}",
      unlock: "Desbloquear con {sensorType}",
    },
  },
  menu: {
    alert: {deleteAccount: "¿Estás seguro de que deseas eliminar tu cuenta?"},
    anonymous: "Anónimo:",
    connected: "Conectado a la base de datos:",
    createdAt: "Creado el:",
    deleteAccount: "Eliminar cuenta",
    login: "Iniciar sesión",
    logout: "Cerrar sesión",
    terms: "Términos de Servicio",
    title: "Menú",
  },
  task: {
    locked: "Esta tarea está bloqueada",
  },
};
