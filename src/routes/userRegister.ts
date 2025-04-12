// userRegister.ts
import { createFileRoute } from "@tanstack/react-router";
import UserRegister from "../pages/UserRegister";
import { authGuard } from "../common/isTokenValid";

export const Route = createFileRoute("/userRegister")({
  component: UserRegister,
  beforeLoad: () => {
    authGuard(); // Call the authGuard function to check authentication
    return false; // Allow access to this route
  },
});
