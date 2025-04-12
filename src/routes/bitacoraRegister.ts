import { createFileRoute } from '@tanstack/react-router';
import  BitacoraRegister  from '../pages/BitacoraRegister';
import { authGuard } from '../common/isTokenValid';

export const Route = createFileRoute('/bitacoraRegister')({
  component: BitacoraRegister,
  beforeLoad: authGuard
})