import { createFileRoute } from '@tanstack/react-router';
import NewHome from '../pages/NewHome';
import { authGuard } from "../common/isTokenValid";

export const Route = createFileRoute('/newHome')({
  component: NewHome,
  beforeLoad: authGuard,
})