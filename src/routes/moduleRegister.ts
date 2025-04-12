import { createFileRoute } from '@tanstack/react-router';
import ModuleRegsiter from '../pages/ModuleRegister';
import { authGuard } from '../common/isTokenValid';

export const Route = createFileRoute('/moduleRegister')({
  component: ModuleRegsiter,
  beforeLoad: authGuard
})