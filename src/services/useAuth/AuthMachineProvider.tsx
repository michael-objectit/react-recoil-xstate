import { useInterpret } from "@xstate/react/lib/useInterpret";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import { login, logout } from "../../api/auth";
import useLocalStorage from "../useLocalStorage/useLocalStorage";
import authMachine from "../../state-machines/auth.machine";

function useAuthMachine() {
  const navigateTo = useNavigate();
  const [authSession, persistAuthSession, resetAuthSession] =
    useLocalStorage("auth.session");

  return useInterpret(authMachine, {
    services: {
      login:
        (_, { email }) =>
        async () =>
          await login(email),
      logout,
    },
    actions: {
      saveSession: (_, { data }) => {
        persistAuthSession(data);
      },
      clearSession: () => {
        resetAuthSession();
      },
      redirect_to_dashboard: () => {
        navigateTo(`/dashboard`);
      },
      redirect_to_login: () => {
        navigateTo(`/`);
      },
    },
    guards: {
      hasValidToken: () => !!authSession?.id,
    },
  });
}

type MachineService = ReturnType<typeof useInterpret>;

export const AuthMachineContext = createContext({} as MachineService);

export const AuthMachineProvider = (props: {
  children: JSX.Element | JSX.Element[];
}) => {
  const authService = useAuthMachine();

  return (
    <AuthMachineContext.Provider value={authService}>
      {props.children}
    </AuthMachineContext.Provider>
  );
};
