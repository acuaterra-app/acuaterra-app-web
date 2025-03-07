const API_BASE_URL: string = import.meta.env["VITE_API_BASE_URL"] as string;

interface tokenResponse {
    token: string;
    user: {
        id: number;
       
    };
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

    return response.json() as Promise<LoginResponse>;
};

export const logout = async (): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/users/cerrarSecionMVC`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "authorization": `${localStorage.getItem("token")}`,
        },
    });

    if (!response.ok) {
        throw new Error("Logout failed");
    }
};