import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean; // Indica si el usuario está autenticado
  login: () => void; // Función para iniciar sesión
  logout: () => void; // Función para cerrar sesión
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false, // Estado inicial: no autenticado
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  login: () => { set({ isAuthenticated: true }); }, // Cambiar el estado a autenticado
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  logout: () => { set({ isAuthenticated: false }); }, // Cambiar el estado a no autenticado
}));