import { createFileRoute } from '@tanstack/react-router';
import Report from '../pages/Report';
import { authGuard } from "../common/isTokenValid"; //first line

export const Route = createFileRoute('/report')({
  component: Report,
  beforeLoad: authGuard, //second linegit status
  
})