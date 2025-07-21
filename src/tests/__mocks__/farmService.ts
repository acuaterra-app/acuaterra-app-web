/* eslint-disable @typescript-eslint/naming-convention */
import { vi } from 'vitest';
import type { Farm, FarmRequest, User } from '../../common/types';

// Datos de prueba para usuarios
const mockUsers: Array<User> = [
  {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan@test.com',
    n_documento_identidad: '12345678',
    sede: 'SENA - Sede Norte',
    rol: 'Admin',
    usuario_ficha: '2024001',
    jornada: 'Diurna',
    usuario_programa: 'Análisis y Desarrollo de Software',
    instructor_ficha: null,
    instructor_programa: null
  },
  {
    id: 2,
    name: 'María García',
    email: 'maria@test.com',
    n_documento_identidad: '87654321',
    sede: 'SENA - Sede Sur',
    rol: 'Owner',
    usuario_ficha: '2024002',
    jornada: 'Nocturna',
    usuario_programa: 'Tecnología en Acuicultura',
    instructor_ficha: null,
    instructor_programa: null
  }
];

// Datos de prueba para granjas
export const mockFarms: Array<Farm> = [
  {
    id: 1,
    name: 'Granja Acuapónica Norte',
    latitude: '4.7110',
    longitude: '-74.0721',
    address: 'Calle 123 #45-67, Bogotá',
    users: [mockUsers[0] as User],
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z'
  },
  {
    id: 2,
    name: 'Granja Hidropónica Sur',
    latitude: '4.5709',
    longitude: '-74.2973',
    address: 'Carrera 789 #12-34, Bogotá',
    users: [mockUsers[1] as User],
    createdAt: '2024-01-20T14:15:00.000Z',
    updatedAt: '2024-01-20T14:15:00.000Z'
  }
];

// Mock API Response structure
const createMockApiResponse = (data: Array<Farm>, hasError = false): {
  message: string;
  data: Array<Farm>;
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
  message: hasError ? 'Error en la operación' : 'Operación exitosa',
  data,
  errors: hasError ? ['Error simulado'] : [],
  meta: {
    pagination: {
      total: data.length,
      totalPages: 1,
      currentPage: 1,
      perPage: 10,
      hasNext: false,
      hasPrev: false
    }
  }
});

// Mock del servicio fetchFarms
export const fetchFarms = vi.fn().mockImplementation(
  async (page: number = 1, limit: number = 10) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFarms = mockFarms.slice(startIndex, endIndex);
    
    return Promise.resolve({
      data: paginatedFarms,
      total: mockFarms.length
    });
  }
);

// Mock del servicio createFarm
export const createFarm = vi.fn().mockImplementation(
  async (farmData: FarmRequest) => {
    const newFarm: Farm = {
      id: mockFarms.length + 1,
      ...farmData,
      users: farmData.users || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Simular validación
    if (!farmData.name || farmData.name.trim() === '') {
      return Promise.resolve(createMockApiResponse([], true));
    }
    
    mockFarms.push(newFarm);
    return Promise.resolve(createMockApiResponse([newFarm]));
  }
);

// Mock del servicio updateFarm
export const updateFarm = vi.fn().mockImplementation(
  async (farmId: number, farmData: FarmRequest) => {
    const farmIndex = mockFarms.findIndex(farm => farm.id === farmId);
    
    if (farmIndex === -1) {
      return Promise.resolve(createMockApiResponse([], true));
    }
    
    const existingFarm = mockFarms[farmIndex];
    if (!existingFarm) {
      return Promise.resolve(createMockApiResponse([], true));
    }
    
    const updatedFarm: Farm = {
      ...existingFarm,
      ...farmData,
      id: existingFarm.id,
      updatedAt: new Date().toISOString()
    };
    
    mockFarms[farmIndex] = updatedFarm;
    return Promise.resolve(createMockApiResponse([updatedFarm]));
  }
);

// Mock del servicio deleteFarm
export const deleteFarm = vi.fn().mockImplementation(
  async (farmId: number) => {
    const farmIndex = mockFarms.findIndex(farm => farm.id === farmId);
    
    if (farmIndex === -1) {
      return Promise.resolve(createMockApiResponse([], true));
    }
    
    const deletedFarm = mockFarms.splice(farmIndex, 1)[0];
    if (!deletedFarm) {
      return Promise.resolve(createMockApiResponse([], true));
    }
    
    return Promise.resolve(createMockApiResponse([deletedFarm]));
  }
);

// Función auxiliar para resetear mocks
export const resetFarmMocks = (): void => {
  // Restaurar datos originales
  mockFarms.length = 0;
  mockFarms.push(
    {
      id: 1,
      name: 'Granja Acuapónica Norte',
      latitude: '4.7110',
      longitude: '-74.0721',
      address: 'Calle 123 #45-67, Bogotá',
      users: [mockUsers[0]],
      createdAt: '2024-01-15T10:30:00.000Z',
      updatedAt: '2024-01-15T10:30:00.000Z'
    },
    {
      id: 2,
      name: 'Granja Hidropónica Sur',
      latitude: '4.5709',
      longitude: '-74.2973',
      address: 'Carrera 789 #12-34, Bogotá',
      users: [mockUsers[1]],
      createdAt: '2024-01-20T14:15:00.000Z',
      updatedAt: '2024-01-20T14:15:00.000Z'
    }
  );
  
  // Limpiar llamadas de los mocks
  vi.clearAllMocks();
};
  message: hasError ? 'Error en la operación' : 'Operación exitosa',
  data,
  errors: hasError ? ['Error simulado'] : [],
  meta: {
    pagination: {
      total: data.length,
      totalPages: 1,
      currentPage: 1,
      perPage: 10,
      hasNext: false,
      hasPrev: false
    }
  }
});

// Mock del servicio fetchFarms
export const fetchFarms = vi.fn().mockImplementation(
  async (page: number = 1, limit: number = 10) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFarms = mockFarms.slice(startIndex, endIndex);
    
    return Promise.resolve({
      data: paginatedFarms,
      total: mockFarms.length
    });
  }
);

// Mock del servicio createFarm
export const createFarm = vi.fn().mockImplementation(
  async (farmData: FarmRequest) => {
    const newFarm: Farm = {
      id: mockFarms.length + 1,
      ...farmData,
      users: farmData.users || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Simular validación
    if (!farmData.name || farmData.name.trim() === '') {
      return Promise.resolve(createMockApiResponse([], true));
    }
    
    mockFarms.push(newFarm);
    return Promise.resolve(createMockApiResponse([newFarm]));
  }
);

// Mock del servicio updateFarm
export const updateFarm = vi.fn().mockImplementation(
  async (farmId: number, farmData: FarmRequest) => {
    const farmIndex = mockFarms.findIndex(farm => farm.id === farmId);
    
    if (farmIndex === -1) {
      return Promise.resolve(createMockApiResponse([], true));
    }
    
    const updatedFarm: Farm = {
      ...mockFarms[farmIndex],
      ...farmData,
      updatedAt: new Date().toISOString()
    };
    
    mockFarms[farmIndex] = updatedFarm;
    return Promise.resolve(createMockApiResponse([updatedFarm]));
  }
);

// Mock del servicio deleteFarm
export const deleteFarm = vi.fn().mockImplementation(
  async (farmId: number) => {
    const farmIndex = mockFarms.findIndex(farm => farm.id === farmId);
    
    if (farmIndex === -1) {
      return Promise.resolve(createMockApiResponse([], true));
    }
    
    const deletedFarm = mockFarms.splice(farmIndex, 1)[0];
    return Promise.resolve(createMockApiResponse([deletedFarm]));
  }
);

// Función auxiliar para resetear mocks
export const resetFarmMocks = () => {
  // Restaurar datos originales
  mockFarms.length = 0;
  mockFarms.push(
    {
      id: 1,
      name: 'Granja Acuapónica Norte',
      latitude: '4.7110',
      longitude: '-74.0721',
      address: 'Calle 123 #45-67, Bogotá',
      users: [{ id: 1, name: 'Juan Pérez', email: 'juan@test.com' }],
      createdAt: '2024-01-15T10:30:00.000Z',
      updatedAt: '2024-01-15T10:30:00.000Z'
    },
    {
      id: 2,
      name: 'Granja Hidropónica Sur',
      latitude: '4.5709',
      longitude: '-74.2973',
      address: 'Carrera 789 #12-34, Bogotá',
      users: [{ id: 2, name: 'María García', email: 'maria@test.com' }],
      createdAt: '2024-01-20T14:15:00.000Z',
      updatedAt: '2024-01-20T14:15:00.000Z'
    }
  );
  
  // Limpiar llamadas de los mocks
  vi.clearAllMocks();
};
