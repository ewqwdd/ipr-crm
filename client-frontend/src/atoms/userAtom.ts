import { $api } from "@/shared/lib/$api";
import type { User } from "@/shared/types/User";
import { atom } from "jotai";

export const userAtom = atom<User | null>(null);

export const userLoadingAtom = atom(true);

export const checkAuthAtom = atom(
  (get) => get(userAtom),
  async (_, set) => {
    set(userLoadingAtom, true);

    try {
      const { data } = await $api.get<User>("/auth/me");
      set(userAtom, data);
      return data;
    } catch (error) {
      console.error("Ошибка проверки авторизации:", error);
      set(userAtom, null);
      return null;
    } finally {
      set(userLoadingAtom, false);
    }
  },
);
