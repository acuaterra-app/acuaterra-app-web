/* eslint-disable @typescript-eslint/naming-convention */
import { vi } from 'vitest';
import type { UserResponse, UserRequestV2, UserRole } from '../../common/types';

// Datos de prueba para roles
const mockRoles: Array<UserRole> = [
  { name: 'Admin' },
  { name: 'Owner' },
  { name: 'User' }
];

// Datos de prueba para usuarios
export const mockUsers: Array<UserResponse> = [
  {
    id: 1,
    name: 'Juan Pérez González',
    email: 'juan.perez@acuaterra.com',
    dni: '12345678',
    id_rol: 1,
    address: 'Calle 123 #45-67, Bogotá',
    contact: '+57 300 123 4567',
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z',
    rol: mockRoles[0] as UserRole
  },
  {
    id: 2,
    name: 'María García López',
    email: 'maria.garcia@acuaterra.com',
    dni: '87654321',
    id_rol: 2,
    address: 'Carrera 789 #12-34, Medellín',
    contact: '+57 301 987 6543',
    createdAt: '2024-01-20T14:15:00.000Z',
    updatedAt: '2024-01-20T14:15:00.000Z',
    rol: mockRoles[1] as UserRole
  },
  {
    id: 3,
    name: 'Carlos Rodríguez Silva',
    email: 'carlos.rodriguez@acuaterra.com',
    dni: '11223344',
    id_rol: 3,
    address: 'Avenida 456 #78-90, Cali',
    contact: '+57 302 555 7788',
    createdAt: '2024-02-01T09:00:00.000Z',
    updatedAt: '2024-02-01T09:00:00.000Z',
    rol: mockRoles[2] as UserRole
  }
];

// Mock API Response structure para usuarios
const createMockUserApiResponse = (data: Array<UserResponse>, hasError = false): {
  message: string;
  data: Array<UserResponse>;
  errors: Array<string>;
  meta: {
    pagination: {
      total: number;
      totalPages: number;
      currentPage: number;
      perPage: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
} => ({
  message: hasError ? 'Error en la operación de usuarios' : 'Operación de usuarios exitosa',
  data,
  errors: hasError ? ['Error simulado en usuarios'] : [],
  meta: {
    pagination: {
      total: data.length,
      totalPages: Math.ceil(data.length / 10),
      currentPage: 1,
      perPage: 10,
      hasNext: data.length > 10,
      hasPrev: false
    }
  }
});

// Mock del servicio fetchUsers con paginación
export const fetchUsers = vi.fn().mockImplementation(
  async (page: number = 1, limit: number = 10) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = mockUsers.slice(startIndex, endIndex);
    
    return Promise.resolve({
      data: paginatedUsers,
      total: mockUsers.length,
      page,
      limit,
      totalPages: Math.ceil(mockUsers.length / limit)
    });
  }
);

// Mock del servicio fetchAllUsers para búsqueda global
export const fetchAllUsers = vi.fn().mockImplementation(
  async () => {
    return Promise.resolve(createMockUserApiResponse(mockUsers));
  }
);

// Mock del servicio createUser
export const createUser = vi.fn().mockImplementation(
  async (userData: UserRequestV2) => {
    // Simular validaciones básicas
    if (!userData.name || userData.name.trim() === '') {
      return Promise.resolve({
        success: false,
        message: 'El nombre es requerido',
        data: null
      });
    }
    
    if (!userData.email || !userData.email.includes('@')) {
      return Promise.resolve({
        success: false,
        message: 'Email inválido',
        data: null
      });
    }
    
    if (!userData.dni || userData.dni.trim() === '') {
      return Promise.resolve({
        success: false,
        message: 'El DNI es requerido',
        data: null
      });
    }
    
    const newUser: UserResponse = {
      id: mockUsers.length + 1,
      name: userData.name,
      email: userData.email,
      dni: userData.dni,
      id_rol: userData.id_rol || 3,
      address: userData.address || '',
      contact: userData.contact || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rol: mockRoles.find(role => role.name === (userData.id_rol === 1 ? 'Admin' : userData.id_rol === 2 ? 'Owner' : 'User')) || mockRoles[2] as UserRole
    };
    
    mockUsers.push(newUser);
    
    return Promise.resolve({
      success: true,
      message: 'Usuario creado exitosamente',
      data: newUser
    });
  }
);

// Mock del servicio updateUser
export const updateUser = vi.fn().mockImplementation(
  async (userId: number, userData: UserRequestV2) => {
    const userIndex = mockUsers.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return Promise.reject(new Error('Usuario no encontrado'));
    }
    
    // Validaciones
    if (!userData.name || userData.name.trim() === '') {
      return Promise.reject(new Error('El nombre es requerido'));
    }
    
    if (!userData.email || !userData.email.includes('@')) {
      return Promise.reject(new Error('Email inválido'));
    }
    
    const existingUser = mockUsers[userIndex];
    if (!existingUser) {
      return Promise.reject(new Error('Usuario no encontrado'));
    }
    
    const updatedUser: UserResponse = {
      ...existingUser,
      name: userData.name,
      email: userData.email,
      dni: userData.dni,
      id_rol: userData.id_rol || existingUser.id_rol,
      address: userData.address || existingUser.address,
      contact: userData.contact || existingUser.contact,
      updatedAt: new Date().toISOString(),
      rol: mockRoles.find(role => role.name === (userData.id_rol === 1 ? 'Admin' : userData.id_rol === 2 ? 'Owner' : 'User')) || existingUser.rol
    };
    
    mockUsers[userIndex] = updatedUser;
    
    return Promise.resolve(createMockUserApiResponse([updatedUser]));
  }
);

// Mock del servicio deleteUser
export const deleteUser = vi.fn().mockImplementation(
  async (userId: number) => {
    const userIndex = mockUsers.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return Promise.reject(new Error('Usuario no encontrado'));
    }
    
    const deletedUser = mockUsers.splice(userIndex, 1)[0];
    if (!deletedUser) {
      return Promise.reject(new Error('Error al eliminar usuario'));
    }
    
    return Promise.resolve({
      success: true,
      message: 'Usuario eliminado exitosamente',
      data: deletedUser
    });
  }
);

// Mock para hook useRegisterUser
export const mockUseRegisterUser = {
  registerUser: vi.fn().mockImplementation(async (userData: UserRequestV2) => {
    return createUser(userData);
  })
};

// Función auxiliar para resetear mocks
export const resetUserMocks = (): void => {
  // Restaurar datos originales
  mockUsers.length = 0;
  mockUsers.push(
    {
      id: 1,
      name: 'Juan Pérez González',
      email: 'juan.perez@acuaterra.com',
      dni: '12345678',
      id_rol: 1,
      address: 'Calle 123 #45-67, Bogotá',
      contact: '+57 300 123 4567',
      createdAt: '2024-01-15T10:30:00.000Z',
      updatedAt: '2024-01-15T10:30:00.000Z',
      rol: mockRoles[0] as UserRole
    },
    {
      id: 2,
      name: 'María García López',
      email: 'maria.garcia@acuaterra.com',
      dni: '87654321',
      id_rol: 2,
      address: 'Carrera 789 #12-34, Medellín',
      contact: '+57 301 987 6543',
      createdAt: '2024-01-20T14:15:00.000Z',
      updatedAt: '2024-01-20T14:15:00.000Z',
      rol: mockRoles[1] as UserRole
    },
    {
      id: 3,
      name: 'Carlos Rodríguez Silva',
      email: 'carlos.rodriguez@acuaterra.com',
      dni: '11223344',
      id_rol: 3,
      address: 'Avenida 456 #78-90, Cali',
      contact: '+57 302 555 7788',
      createdAt: '2024-02-01T09:00:00.000Z',
      updatedAt: '2024-02-01T09:00:00.000Z',
      rol: mockRoles[2] as UserRole
    }
  );
  
  // Limpiar llamadas de los mocks
  vi.clearAllMocks();
};
