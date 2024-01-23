import { create } from "zustand";

export const userNightMode = create((set) => ({
  nighmode: false,
  setNightMode: (click: boolean) => set({ nighmode: click }),
}));
