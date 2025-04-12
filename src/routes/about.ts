import { createFileRoute } from "@tanstack/react-router";
import { About } from "../pages/About";
import { authGuard } from "../common/isTokenValid";

export const Route = createFileRoute("/about")({
	component: About,
	beforeLoad: authGuard
});
