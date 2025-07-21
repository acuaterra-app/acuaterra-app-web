/* eslint-disable @typescript-eslint/naming-convention */
import { vi } from 'vitest';
import type { Bitacora, CreateBitacoraRequest, UpdateBitacoraRequest } from '../../common/types';

// Datos de prueba para bitácoras
export const mockBitacoras: Array<Bitacora> = [
  {
    id_bitacora: 1,
    id_modulo: 101,
    fecha: '2024-01-15',
    descripcion: 'Revisión inicial del sistema acuapónico. Verificación de niveles de pH y temperatura del agua.'
  },
  {
    id_bitacora: 2,
    id_modulo: 102,
    fecha: '2024-01-20',
    descripcion: 'Mantenimiento preventivo de bomba de agua. Limpieza de filtros y verificación de flujo.'
  },
  {
    id_bitacora: 3,
    id_modulo: 101,
    fecha: '2024-01-25',
    descripcion: 'Alimentación de peces programada. Observación del comportamiento y crecimiento.'
  }
];

// Mock API Response structure
const createMockApiResponse = (data: Array<Bitacora>, hasError = false): {
  message: string;
  data: Array<Bitacora>;
  errors: Array<string>;
} => ({
  message: hasError ? 'Error en la operación' : 'Operación exitosa',
  data,
  errors: hasError ? ['Error simulado'] : []
});

// Mock del servicio fetchBitacoras
export const fetchBitacoras = vi.fn().mockImplementation(
  async () => {
    return Promise.resolve(mockBitacoras);
  }
);

// Mock del servicio createBitacora
export const createBitacora = vi.fn().mockImplementation(
  async (bitacoraData: CreateBitacoraRequest) => {
    const newBitacora: Bitacora = {
      id_bitacora: mockBitacoras.length + 1,
      ...bitacoraData,
    };
    
    // Simular validación
    if (!bitacoraData.descripcion || bitacoraData.descripcion.trim() === '') {
      return Promise.resolve(createMockApiResponse([], true));
    }
    
    if (!bitacoraData.fecha || bitacoraData.fecha.trim() === '') {
      return Promise.resolve(createMockApiResponse([], true));
    }
    
    mockBitacoras.push(newBitacora);
    return Promise.resolve(createMockApiResponse([newBitacora]));
  }
);

// Mock del servicio updateBitacora
export const updateBitacora = vi.fn().mockImplementation(
  async (bitacoraId: number, bitacoraData: UpdateBitacoraRequest) => {
    const bitacoraIndex = mockBitacoras.findIndex(bitacora => bitacora.id_bitacora === bitacoraId);
    
    if (bitacoraIndex === -1) {
      return Promise.resolve(createMockApiResponse([], true));
    }
    
    const existingBitacora = mockBitacoras[bitacoraIndex];
    if (!existingBitacora) {
      return Promise.resolve(createMockApiResponse([], true));
    }
    
    const updatedBitacora: Bitacora = {
      ...existingBitacora,
      ...bitacoraData,
      id_bitacora: existingBitacora.id_bitacora,
    };
    
    mockBitacoras[bitacoraIndex] = updatedBitacora;
    return Promise.resolve(createMockApiResponse([updatedBitacora]));
  }
);

// Mock del servicio deleteBitacora
export const deleteBitacora = vi.fn().mockImplementation(
  async (bitacoraId: number) => {
    const bitacoraIndex = mockBitacoras.findIndex(bitacora => bitacora.id_bitacora === bitacoraId);
    
    if (bitacoraIndex === -1) {
      return Promise.resolve(createMockApiResponse([], true));
    }
    
    const deletedBitacora = mockBitacoras.splice(bitacoraIndex, 1)[0];
    if (!deletedBitacora) {
      return Promise.resolve(createMockApiResponse([], true));
    }
    
    return Promise.resolve(createMockApiResponse([deletedBitacora]));
  }
);

// Función auxiliar para resetear mocks
export const resetBitacoraMocks = (): void => {
  // Restaurar datos originales
  mockBitacoras.length = 0;
  mockBitacoras.push(
    {
      id_bitacora: 1,
      id_modulo: 101,
      fecha: '2024-01-15',
      descripcion: 'Revisión inicial del sistema acuapónico. Verificación de niveles de pH y temperatura del agua.'
    },
    {
      id_bitacora: 2,
      id_modulo: 102,
      fecha: '2024-01-20',
      descripcion: 'Mantenimiento preventivo de bomba de agua. Limpieza de filtros y verificación de flujo.'
    },
    {
      id_bitacora: 3,
      id_modulo: 101,
      fecha: '2024-01-25',
      descripcion: 'Alimentación de peces programada. Observación del comportamiento y crecimiento.'
    }
  );
  
  // Limpiar llamadas de los mocks
  vi.clearAllMocks();
};
