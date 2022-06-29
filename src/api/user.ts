import { apiService } from "./api";

export const fetchUser = async (userId: string) => {
  return await new Promise(async (resolve) => {
    const response = await apiService(`/users/${userId}`);
    setTimeout(() => {
      resolve(response);
    }, 1000);
  });
};
