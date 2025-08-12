// src/store/auth.ts
import { create } from "zustand";
import { login as apiLogin, signup as apiSignup, logout as apiLogout } from "@/lib/auth";

type AuthState = {
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setToken: (token: string | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  isAuthenticated: !!(typeof window !== "undefined" && localStorage.getItem("token")),

  setToken: (token) => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
    set({ token, isAuthenticated: !!token });
  },

  login: async (email, password) => {
    const res = await apiLogin(email, password);
    if (res.token) set({ token: res.token, isAuthenticated: true });
  },

  signup: async (email, password) => {
    const res = await apiSignup(email, password);
    if (res.token) set({ token: res.token, isAuthenticated: true });
  },

  logout: async () => {
    await apiLogout();
    set({ token: null, isAuthenticated: false });
  },
}));

