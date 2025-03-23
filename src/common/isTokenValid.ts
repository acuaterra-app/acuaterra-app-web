export const isTokenValid = (): boolean => {
	const token = localStorage.getItem("token");
	console.log("Token encontrado:", token); 
	return !!token;
  };

/**
 * Auth guard function to check if the token is valid.
 * If the token is not valid, it redirects to the authentication page.
 *
 * @returns An object containing the redirect path if the token is invalid, otherwise an empty object.
 */
export const authGuard = (): { redirect?: string } => {
	console.log("authGuard ejecutado"); 
	if (!isTokenValid()) {
	  console.log("Token no válido, redirigiendo a /auth"); 
	  return {
		redirect: "/auth",
	  };
	}
	console.log("Token válido, acceso permitido"); 
	return {};
  };
