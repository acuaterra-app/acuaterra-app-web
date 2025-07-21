// Mock del servicio de usuarios para las pruebas
import { vi } from 'vitest';
import type { ResponseType, UserResponse, UserRequestV2 } from "../../common/types";

// Mock data
export const mockUsers: Array<UserResponse> = [
  {
    id: 1,
    name: "Juan Pérez",
    email: "juan.perez@test.com",
    dni: "12345678",
    id_rol: 1,
    contact: "123456789",
    address: "Calle 123",
    rol: { name: "ADMIN" },
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
  },
  {
    id: 2,
    name: "María García",
    email: "maria.garcia@test.com",
    dni: "87654321",
    id_rol: 2,
    contact: "987654321",
    address: "Avenida 456",
    rol: { name: "USER" },
    createdAt: "2024-01-02T00:00:00.000Z",
    updatedAt: "2024-01-02T00:00:00.000Z"
  }
];

export const mockResponse: ResponseType<UserResponse> = {
  message: "Usuarios obtenidos exitosamente",
  data: mockUsers,
  errors: [],
  meta: {
    pagination: {
      total: 2,
      hasNext: false,
      hasPrev: false
    }
  }
};

// Mock functions
export const fetchUsers = vi.fn().mockResolvedValue(mockResponse);

export const createUser = vi.fn().mockImplementation((userData: UserRequestV2) => {
  const newUser: UserResponse = {
    id: 3,
    name: userData.name,
    email: userData.email,
    dni: userData.dni,
    id_rol: userData.id_rol,
    contact: userData.contact,
    address: userData.address,
    rol: { name: "USER" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  return Promise.resolve({
    message: "Usuario creado exitosamente",
    data: [newUser],
    errors: [],
    meta: {
      pagination: {
        total: 1,
        hasNext: false,
        hasPrev: false
      }
    }
  });
});

export const updateUser = vi.fn().mockImplementation((id: number, userData: UserRequestV2) => {
  const updatedUser: UserResponse = {
    id,
    name: userData.name,
    email: userData.email,
    dni: userData.dni,
    id_rol: userData.id_rol,
    contact: userData.contact,
    address: userData.address,
    rol: { name: "USER" },
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: new Date().toISOString()
  };
  
  return Promise.resolve({
    message: "Usuario actualizado exitosamente",
    data: [updatedUser],
    errors: [],
    meta: {
      pagination: {
        total: 1,
        hasNext: false,
        hasPrev: false
      }
    }
  });
});

export const deleteUser = vi.fn().mockResolvedValue({
  message: "Usuario eliminado exitosamente",
  data: [],
  errors: [],
  meta: {
    pagination: {
      total: 0,
      hasNext: false,
      hasPrev: false
    }
  }
});

export const fetchAllUsers = vi.fn().mockResolvedValue(mockResponse);
