import { useState, useEffect } from 'react';

/**
 * Hook personalizado para implementar debounce en valores
 * Útil para evitar realizar búsquedas excesivas mientras el usuario escribe
 */
const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return (): void => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
