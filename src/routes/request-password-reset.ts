import { createFileRoute } from "@tanstack/react-router";
import { RequestPasswordReset } from "../pages/RequestPasswordReset";

export const Route = createFileRoute("/request-password-reset")({
  component: RequestPasswordReset,
});