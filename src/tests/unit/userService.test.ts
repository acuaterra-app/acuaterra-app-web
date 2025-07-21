/**
 * @jest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchUsers, createUser, updateUser, deleteUser, fetchAllUsers } from '../../services/userService';
import type { UserRequestV2 } from '../../common/types';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

// Mock environment variable
vi.mock('../../environment', () => ({
  API_BASE_URL: 'http://localhost:3000/api'
}));

describe('🧪 PRUEBAS UNITARIAS - userService', () => {
  const mockToken = 'mock-jwt-token';

  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(mockToken);
    
    // Mock successful response by default
    mockFetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        message: 'Success',
        data: [],
        errors: [],
        meta: { pagination: { total: 0, hasNext: false, hasPrev: false } }
      })
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('📊 fetchUsers', () => {
    it('✅ Debe realizar una petición GET correcta para obtener usuarios', async () => {
      const mockResponse = {
        message: 'Usuarios obtenidos exitosamente',
        data: [
          {
            id: 1,
            name: 'Juan Pérez',
            email: 'juan@test.com',
            dni: '12345678',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            id_rol: 1,
            contact: '123456789',
            address: 'Calle 123',
            rol: { name: 'ADMIN' },
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
          }
        ],
        errors: [],
        meta: { pagination: { total: 1, hasNext: false, hasPrev: false } }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse)
      });

      const result = await fetchUsers(1, 10);

      expect(mockFetch).toHaveBeenCalledWith(
        'undefined/admin/users?page=1&limit=10',
        {
          method: 'GET',
          headers: {
            Authorization: mockToken,
            'Content-Type': 'application/json'
          }
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('❌ Debe lanzar error cuando la respuesta no es exitosa', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      await expect(fetchUsers(1, 10)).rejects.toThrow('Network response was not ok');
    });

    it('🔐 Debe incluir el token de autorización en las cabeceras', async () => {
      await fetchUsers(1, 10);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: mockToken
          })
        })
      );
    });
  });

  describe('➕ createUser', () => {
    const userData: UserRequestV2 = {
      name: 'Nuevo Usuario',
      email: 'nuevo@test.com',
      dni: '87654321',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      id_rol: 2,
      contact: '987654321',
      address: 'Nueva Dirección'
    };

    it('✅ Debe crear un usuario correctamente', async () => {
      const mockResponse = {
        message: 'Usuario creado exitosamente',
        data: [{ ...userData, id: 1, rol: { name: 'USER' }, createdAt: '2024-01-01', updatedAt: '2024-01-01' }],
        errors: [],
        meta: { pagination: { total: 1, hasNext: false, hasPrev: false } }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse)
      });

      const result = await createUser(userData);

      expect(mockFetch).toHaveBeenCalledWith(
        'undefined/shared/users',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: mockToken
          },
          body: JSON.stringify(userData)
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('❌ Debe manejar errores de validación del backend', async () => {
      const errorResponse = {
        message: 'Error de validación',
        data: [],
        errors: [
          {
            type: 'validation',
            value: '',
            msg: 'El email ya existe',
            path: 'email',
            location: 'body'
          }
        ],
        meta: {}
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: vi.fn().mockResolvedValue(errorResponse)
      });

      await expect(createUser(userData)).rejects.toThrow();
    });
  });

  describe('✏️ updateUser', () => {
    const userId = 1;
    const userData: UserRequestV2 = {
      name: 'Usuario Actualizado',
      email: 'actualizado@test.com',
      dni: '87654321',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      id_rol: 2,
      contact: '987654321',
      address: 'Dirección Actualizada'
    };

    it('✅ Debe actualizar un usuario correctamente', async () => {
      const mockResponse = {
        message: 'Usuario actualizado exitosamente',
        data: [{ ...userData, id: userId, rol: { name: 'USER' }, createdAt: '2024-01-01', updatedAt: '2024-01-02' }],
        errors: [],
        meta: { pagination: { total: 1, hasNext: false, hasPrev: false } }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse)
      });

      const result = await updateUser(userId, userData);

      expect(mockFetch).toHaveBeenCalledWith(
        `undefined/admin/users/${userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: mockToken
          },
          body: JSON.stringify(userData)
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('❌ Debe lanzar error cuando el usuario no existe', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      await expect(updateUser(999, userData)).rejects.toThrow();
    });
  });

  describe('🗑️ deleteUser', () => {
    const userId = 1;

    it('✅ Debe eliminar un usuario correctamente', async () => {
      const mockResponse = {
        message: 'Usuario eliminado exitosamente',
        data: [],
        errors: [],
        meta: { pagination: { total: 0, hasNext: false, hasPrev: false } }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse)
      });

      const result = await deleteUser(userId);

      expect(mockFetch).toHaveBeenCalledWith(
        `undefined/admin/users/${userId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: mockToken,
            'Content-Type': 'application/json'
          }
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('❌ Debe lanzar error cuando el usuario no existe', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      await expect(deleteUser(999)).rejects.toThrow();
    });

    it('🔒 Debe lanzar error cuando no hay autorización', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401
      });

      await expect(deleteUser(userId)).rejects.toThrow();
    });
  });

  describe('📋 fetchAllUsers', () => {
    it('✅ Debe obtener todos los usuarios sin paginación', async () => {
      const mockResponse = {
        message: 'Todos los usuarios obtenidos exitosamente',
        data: [
          {
            id: 1,
            name: 'Usuario 1',
            email: 'user1@test.com',
            dni: '12345678',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            id_rol: 1,
            contact: '123456789',
            address: 'Dirección 1',
            rol: { name: 'ADMIN' },
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
          },
          {
            id: 2,
            name: 'Usuario 2',
            email: 'user2@test.com',
            dni: '87654321',
            // eslint-disable-next-line @typescript-eslint/naming-convention
            id_rol: 2,
            contact: '987654321',
            address: 'Dirección 2',
            rol: { name: 'USER' },
            createdAt: '2024-01-02T00:00:00.000Z',
            updatedAt: '2024-01-02T00:00:00.000Z'
          }
        ],
        errors: [],
        meta: { pagination: { total: 2, hasNext: false, hasPrev: false } }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse)
      });

      const result = await fetchAllUsers();

      expect(mockFetch).toHaveBeenCalledWith(
        'undefined/admin/users?page=1&limit=10000',
        {
          method: 'GET',
          headers: {
            Authorization: mockToken,
            'Content-Type': 'application/json'
          }
        }
      );
      expect(result).toEqual(mockResponse);
      expect(result.data).toHaveLength(2);
    });
  });
});
