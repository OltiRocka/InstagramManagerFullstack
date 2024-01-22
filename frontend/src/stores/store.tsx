import { create } from "zustand";

export const userNightMode = create((set) => ({
  nighmode: false,
  setNightMode: (click: boolean) => set({ nighmode: click }),
}));

interface User {
  first_name: string;
  last_name: string;
  email: string;
  profile_image: string;
}
interface UserStore {
  user: User;
  updateUser: (userData: Partial<User>) => void;
  removeUser: () => void;
}
export const useUserStore = create<UserStore>((set) => ({
  user: {
    first_name: "",
    last_name: "",
    email: "",
    profile_image: "",
  },

  updateUser: (userData: Partial<User>) =>
    set(({ user }) => ({
      user: { ...user, ...userData },
    })),

  removeUser: () =>
    set(() => ({
      user: {
        first_name: "",
        last_name: "",
        email: "",
        profile_image: "",
      },
    })),
}));
