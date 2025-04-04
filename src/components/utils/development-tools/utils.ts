import type { ClassValue} from "clsx";
// eslint-disable-next-line no-duplicate-imports
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}