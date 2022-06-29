import { atom, selector } from "recoil";

export interface User {
  readonly id?: string;
  email: string;
  tenants: string[];
}

const userState = atom<User>({
  key: "userState",
  default: {} as User,
});

export const emailState = selector({
  key: "emailState",
  get: ({ get }) => {
    const { email } = get(userState);
    return email;
  },
});

export default userState;
