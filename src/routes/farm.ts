import { createFileRoute } from "@tanstack/react-router";
import FarmsPage from "../pages/Farm";
import { authGuard } from "../common/isTokenValid";

export const Route = createFileRoute("/farm")({
  component: FarmsPage,
  beforeLoad: authGuard,
});