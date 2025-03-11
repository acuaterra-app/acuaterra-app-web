import { useState } from "react";
import type {  UserResponse, ResponseType, UserRequestV2 } from "../common/types";
import { createUser } from "../services/userService";

const useRegisterUser = (): {
    registerUser: (user: UserRequestV2) => Promise<void>;
    loading: boolean;
    error: string | null;
} => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const registerUser = async (user: UserRequestV2): Promise<void> => {
        try {
            setLoading(true);
            const response: ResponseType<UserResponse> = await createUser(user);
            if (response.errors.length > 0) {
                setError(response.errors.join(", "));
            } else {
                setError(null);
            }
        } catch (error) {
            console.error("Error creating user:", error);
            setError("Error creating user");
        } finally {
            setLoading(false);
        }
    };

    return { registerUser, loading, error };
};

export default useRegisterUser;