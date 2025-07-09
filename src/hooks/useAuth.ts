import type { Dispatch, SetStateAction} from "react";
// eslint-disable-next-line no-duplicate-imports
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { login } from "../services/authService";


export const useAuth = (): {
email: string,
setEmail: Dispatch<SetStateAction<string>>,
password: string,
setPassword: Dispatch<SetStateAction<string>>,
error: string,
loading: boolean,
handleLogin: () => Promise<void>
}=>  {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (): Promise<void> => {
        setLoading(true);
        try {
            const data = await login(email, password);
            const token = data.data[0]?.token;
            const mustChangePassword = data.data[0]?.mustChangePassword;
            console.log("data", token);
            if (data.errors.length != 0 || !token) {
                setError(data.errors[0] ?? "An error occurred");
                return;
            }
            if (mustChangePassword) {
                await navigate({ to: "/request-password-reset" });
                return;
            }
            if (data.data[0]?.user?.id_rol == 1 || data.data[0]?.user?.rol == "ADMIN") {
                localStorage.setItem("token", token);
                localStorage.setItem("userName", data.data[0]?.user?.name);
                await navigate({ to: "/newHome" });
            }else {
                setError("You do not have permission to access this application");
                await navigate({ to: "/auth" });
                return;
            }

            
        } catch (error) {
            setError("Invalid email or password");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        error,
        loading,
        handleLogin,
    };
};