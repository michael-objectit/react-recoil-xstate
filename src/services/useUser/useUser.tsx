import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { fetchUser } from "../../api/user";
import userState, { User } from "../../states/user.state";
import useLocalStorage from "../useLocalStorage/useLocalStorage";

export default function useUser() {
  const [user, setUser] = useRecoilState(userState);
  const [authSession] = useLocalStorage("auth.session");

  useEffect(() => {
    if (authSession?.id) {
      (async function () {
        const _user = await fetchUser(authSession?.id);
        setUser(_user as User);
      })();
    }
  }, [authSession?.id, setUser]);

  return user;
}
