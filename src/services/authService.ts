const API_BASE_URL: string = import.meta.env["VITE_API_BASE_URL"] as string;

interface tokenResponse {
    token: string;
    user: {
        id: number;
        name: string; // Agregamos el campo "name" para reflejar la estructura de la respuesta
    };
    mustChangePassword: boolean;
}

interface LoginResponse {
    message: string;
    data: Array<tokenResponse>;
    errors: Array<string>;
    metadata: object;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        throw new Error("Login failed");
    }

    const result = await response.json() as LoginResponse;

    // Guardar el token y el nombre del usuario en localStorage
    const token = result.data?.[0]?.token;
    const userName = result.data?.[0]?.user?.name;

    if (!token || !userName) {
        throw new Error("Invalid login response: Missing token or user name");
    }

    localStorage.setItem("token", token);
    localStorage.setItem("userName", userName);

    console.log("Inicio de sesión exitoso. Token y nombre del usuario guardados en localStorage:", {
        token,
        userName,
    });

    return result;
};

export const logout = async (): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "authorization": `${localStorage.getItem("token")}`,
        },
    });

    if (!response.ok) {
        throw new Error("Logout failed");
    }

    // Limpiar el localStorage al cerrar sesión
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
};

export const resetPassword = async (data: {
    token: string;
    newPassword: string;
    confirmPassword: string;
}): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Error al cambiar la contraseña");
    }
};

export const requestPasswordReset = async (data: { email: string }): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/auth/request-password-reset`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Error al solicitar el restablecimiento de contraseña");
    }
};