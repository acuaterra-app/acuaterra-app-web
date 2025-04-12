import { createFileRoute } from "@tanstack/react-router";
import { Bitacoras } from '../pages/Bitacoras';
import { authGuard } from "../common/isTokenValid";


export const Route = createFileRoute("/bitacoras")({
    component: Bitacoras,
    beforeLoad: authGuard
});