import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean; 
  login: () => void; 
  logout: () => void; 
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false, 
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  login: () => { console.log("Usuario autenticado");set({ isAuthenticated: true }); }, 
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  logout: () => { console.log("Usuario no autenticado");  set({ isAuthenticated: false }); }, 
}));