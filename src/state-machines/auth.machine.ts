import { createMachine } from "xstate";

export const AuthState = {
  id: "AuthMachine",
  initial: "init",
  states: {
    init: {
      description: "Page visit or reload",
      always: [
        {
          cond: "hasValidToken",
          target: "logged_in",
        },
        {
          target: "logged_out",
        },
      ],
    },
    logged_in: {
      tags: "logout",
      entry: "redirect_to_dashboard",
      on: {
        LOG_OUT: {
          target: "processing_logout",
        },
      },
    },
    logged_out: {
      on: {
        LOG_IN: {
          target: "processing_login",
        },
      },
    },
    processing_login: {
      invoke: {
        src: "login",
        id: "login-user",
        onError: [
          {
            target: "logged_out",
          },
        ],
        onDone: [
          {
            actions: "saveSession",
            target: "logged_in",
          },
        ],
      },
    },
    processing_logout: {
      tags: ["logout", "loading"],
      invoke: {
        src: "logout",
        id: "logout-user",
        onDone: [
          {
            actions: ["clearSession", "redirect_to_login"],
            target: "logged_out",
          },
        ],
        onError: [
          {
            target: "logged_in",
          },
        ],
      },
    },
  },
};

export default createMachine(AuthState);
