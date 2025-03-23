import {jwtDecode} from "jwt-decode";

interface TokenClaims {
  role?: string; // Ajusta según la estructura de tu token
}

export const isTokenValid = (): boolean => {
  const token = localStorage.getItem("token");
  console.log("Token encontrado:", token); 
  return !!token;
};

/**
 * Verifica si el usuario tiene el rol de administrador.
 *
 * @returns `true` si el usuario es administrador, de lo contrario `false`.
 */
export const isAdmin = (): boolean => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("No se encontró un token.");
    return false;
  }

  try {
    const decoded: TokenClaims = jwtDecode(token);
    console.log("Claims decodificados:", decoded);
    return decoded.role === "1";
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return false;
  }
};

/**
 * Auth guard function to check if the token is valid and if the user is an admin.
 * If the token is not valid or the user is not an admin, it redirects to the authentication page.
 *
 * @returns An object containing the redirect path if the token is invalid or the user is not an admin, otherwise an empty object.
 */
export const authGuard = (): { redirect?: string } => {
  console.log("authGuard ejecutado"); 
  if (!isTokenValid()) {
    console.log("Token no válido, redirigiendo a /auth"); 
    return {
      redirect: "/auth",
    };
  }
  console.log("Token válido y usuario autorizado, acceso permitido"); 
  return {};
};
