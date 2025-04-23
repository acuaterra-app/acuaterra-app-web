import { createFileRoute } from '@tanstack/react-router'
import Home from '../pages/Home'
import { authGuard } from '../common/isTokenValid';

export const Route = createFileRoute('/home')({
  component: Home,
  beforeLoad: () => {
        const guardResult = authGuard();
        if (guardResult.redirect === "/newHome") {
          window.location.href = guardResult.redirect;
          return false;
        }
        return true;
        },
})