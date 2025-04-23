import { createFileRoute } from "@tanstack/react-router";
import { Auth } from "../pages/Auth";
import { authGuard } from "../common/isTokenValid";

export const Route = createFileRoute("/auth")({
	component: Auth,
		beforeLoad: () => {
			const guardResult = authGuard();
			if (guardResult.redirect === "/newHome") {
				window.location.href = guardResult.redirect;
			  return false;
			}
			return true;
		  },
});
