/**
 * @jest-environment jsdom
 */
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useUsers from '../../hooks/useUsers';

// Mock del servicio
vi.mock('../../services/userService', () => ({
  fetchUsers: vi.fn()
}));

import { fetchUsers } from '../../services/userService';
import { mockResponse } from '../__mocks__/userService';

describe('🧪 PRUEBAS UNITARIAS - useUsers Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn().mockReturnValue('mock-token'),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });
  });

  it('✅ Debe inicializar con valores por defecto', () => {
    vi.mocked(fetchUsers).mockResolvedValue(mockResponse);
    
    const { result } = renderHook(() => useUsers());

    expect(result.current.users).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(null);
    expect(result.current.total).toBe(0);
    expect(result.current.page).toBe(1);
    expect(result.current.limit).toBe(10);
  });

  it('✅ Debe cargar usuarios exitosamente', async () => {
    vi.mocked(fetchUsers).mockResolvedValue(mockResponse);
    
    const { result } = renderHook(() => useUsers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.users).toEqual(mockResponse.data);
    expect(result.current.total).toBe(mockResponse.meta.pagination.total);
    expect(result.current.error).toBe(null);
    expect(fetchUsers).toHaveBeenCalledWith(1, 10);
  });

  it('❌ Debe manejar errores correctamente', async () => {
    const errorMessage = 'Error al cargar usuarios';
    vi.mocked(fetchUsers).mockRejectedValue(new Error(errorMessage));
    
    const { result } = renderHook(() => useUsers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Error fetching users');
    expect(result.current.users).toEqual([]);
    expect(result.current.total).toBe(0);
  });

  it('🔄 Debe actualizar la página correctamente', async () => {
    vi.mocked(fetchUsers).mockResolvedValue(mockResponse);
    
    const { result } = renderHook(() => useUsers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Cambiar página
    result.current.setPage(2);

    await waitFor(() => {
      expect(fetchUsers).toHaveBeenCalledWith(2, 10);
    });

    expect(result.current.page).toBe(2);
  });

  it('📄 Debe actualizar el límite correctamente', async () => {
    vi.mocked(fetchUsers).mockResolvedValue(mockResponse);
    
    const { result } = renderHook(() => useUsers());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Cambiar límite
    result.current.setLimit(20);

    await waitFor(() => {
      expect(fetchUsers).toHaveBeenCalledWith(1, 20);
    });

    expect(result.current.limit).toBe(20);
  });

  it('🔄 Debe recargar datos cuando cambia reload', async () => {
    vi.mocked(fetchUsers).mockResolvedValue(mockResponse);
    
    const { result, rerender } = renderHook(
      ({ reload }) => useUsers(reload),
      { initialProps: { reload: false } }
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetchUsers).toHaveBeenCalledTimes(1);

    // Cambiar reload para recargar
    rerender({ reload: true });

    await waitFor(() => {
      expect(fetchUsers).toHaveBeenCalledTimes(2);
    });
  });

  it('📊 Debe manejar paginación inicial personalizada', async () => {
    vi.mocked(fetchUsers).mockResolvedValue(mockResponse);
    
    const { result } = renderHook(() => useUsers(false, 2, 5));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.page).toBe(2);
    expect(result.current.limit).toBe(5);
    expect(fetchUsers).toHaveBeenCalledWith(2, 5);
  });
});
