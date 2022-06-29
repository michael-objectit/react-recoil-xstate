import db from "./db.json";

export const login = async (emailInput: string) => {
  return await new Promise((resolve, reject) => {
    const user = db.users.find(({ email }) => emailInput === email);
    if (!user) {
      reject("invalid email");
      return
    }
    setTimeout(() => {
      resolve(user);
    }, 2000);
  });
};

export const logout = async () => {
  return await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 2000);
  });
};
