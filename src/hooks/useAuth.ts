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
            console.log("data", token);
            if (data.errors.length != 0 || !token) {
                setError(data.errors[0] ?? "An error occurred");
                return;
            }
            localStorage.setItem("token", token);
            console.log("Login successful", token);
            await navigate({ to: "/newHome" });
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