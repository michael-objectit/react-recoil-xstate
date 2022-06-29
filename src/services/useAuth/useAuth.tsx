import { useSelector } from "@xstate/react/lib/useSelector";
import { useContext } from "react";
import { AuthMachineContext } from "./AuthMachineProvider";

export default function useAuth() {
  const authService = useContext(AuthMachineContext);
  const authState = useSelector(authService, (state) => state);
  const { send } = authService;

  return {
    authState,
    sendToAuthMachine: send,
  };
}
