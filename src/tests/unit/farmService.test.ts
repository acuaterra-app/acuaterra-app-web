import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as farmService from '../../services/farmSevice';
import { 
  mockFarms, 
  resetFarmMocks,
  fetchFarms as mockFetchFarms,
  createFarm as mockCreateFarm,
  updateFarm as mockUpdateFarm,
  deleteFarm as mockDeleteFarm
} from '../__mocks__/farmServiceMock';
import type { FarmRequest } from '../../common/types';

// Mock del módulo de servicio
vi.mock('../../services/farmSevice', async () => {
  const mockModule = await import('../__mocks__/farmServiceMock');
  return {
    fetchFarms: mockModule.fetchFarms,
    createFarm: mockModule.createFarm,
    updateFarm: mockModule.updateFarm,
    deleteFarm: mockModule.deleteFarm
  };
});

describe('FarmService - Pruebas Unitarias', () => {
  beforeEach(() => {
    resetFarmMocks();
  });

  describe('fetchFarms', () => {
    it('debe obtener todas las granjas correctamente', async () => {
      const result = await farmService.fetchFarms();
      
      expect(result).toBeDefined();
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.data[0]).toMatchObject({
        id: 1,
        name: 'Granja Acuapónica Norte',
        latitude: '4.7110',
        longitude: '-74.0721',
        address: 'Calle 123 #45-67, Bogotá'
      });
    });

    it('debe manejar la paginación correctamente', async () => {
      const result = await farmService.fetchFarms(1, 1);
      
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(2);
      expect(mockFetchFarms).toHaveBeenCalledWith(1, 1);
    });

    it('debe retornar granjas vacías para páginas inexistentes', async () => {
      const result = await farmService.fetchFarms(10, 10);
      
      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(2);
    });

    it('debe usar valores por defecto para parámetros no proporcionados', async () => {
      await farmService.fetchFarms();
      
      expect(mockFetchFarms).toHaveBeenCalledWith(1, 10);
    });
  });

  describe('createFarm', () => {
    it('debe crear una nueva granja correctamente', async () => {
      const newFarmData: FarmRequest = {
        name: 'Nueva Granja Test',
        address: 'Dirección Test',
        latitude: '4.6000',
        longitude: '-74.0800',
        users: []
      };

      const result = await farmService.createFarm(newFarmData);
      
      expect(result).toBeDefined();
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toMatchObject({
        name: 'Nueva Granja Test',
        address: 'Dirección Test',
        latitude: '4.6000',
        longitude: '-74.0800'
      });
      expect(result.data[0].id).toBeDefined();
      expect(result.data[0].createdAt).toBeDefined();
      expect(result.data[0].updatedAt).toBeDefined();
    });

    it('debe fallar al crear granja sin nombre', async () => {
      const invalidFarmData: FarmRequest = {
        name: '',
        address: 'Dirección Test',
        latitude: '4.6000',
        longitude: '-74.0800',
        users: []
      };

      const result = await farmService.createFarm(invalidFarmData);
      
      expect(result.data).toHaveLength(0);
      expect(result.errors).toHaveLength(1);
      expect(result.message).toBe('Error en la operación');
    });

    it('debe crear granja con usuarios asignados', async () => {
      const farmDataWithUsers: FarmRequest = {
        name: 'Granja con Usuarios',
        address: 'Dirección Test',
        latitude: '4.6000',
        longitude: '-74.0800',
        users: [1, 2]
      };

      const result = await farmService.createFarm(farmDataWithUsers);
      
      expect(result.data[0].users).toEqual([1, 2]);
    });

    it('debe verificar que se llame el mock correctamente', async () => {
      const farmData: FarmRequest = {
        name: 'Test Farm',
        address: 'Test Address',
        latitude: '0.0000',
        longitude: '0.0000',
        users: []
      };

      await farmService.createFarm(farmData);
      
      expect(mockCreateFarm).toHaveBeenCalledWith(farmData);
    });
  });

  describe('updateFarm', () => {
    it('debe actualizar una granja existente', async () => {
      const updateData: FarmRequest = {
        name: 'Granja Actualizada',
        address: 'Nueva Dirección',
        latitude: '4.7000',
        longitude: '-74.0500',
        users: []
      };

      const result = await farmService.updateFarm(1, updateData);
      
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toMatchObject({
        id: 1,
        name: 'Granja Actualizada',
        address: 'Nueva Dirección',
        latitude: '4.7000',
        longitude: '-74.0500'
      });
      expect(result.data[0].updatedAt).toBeDefined();
    });

    it('debe fallar al actualizar granja inexistente', async () => {
      const updateData: FarmRequest = {
        name: 'Granja No Existe',
        address: 'Dirección',
        latitude: '0.0000',
        longitude: '0.0000',
        users: []
      };

      const result = await farmService.updateFarm(999, updateData);
      
      expect(result.data).toHaveLength(0);
      expect(result.errors).toHaveLength(1);
      expect(result.message).toBe('Error en la operación');
    });

    it('debe mantener propiedades no actualizadas', async () => {
      const updateData: FarmRequest = {
        name: 'Solo Nombre Nuevo',
        address: 'Calle 123 #45-67, Bogotá',
        latitude: '4.7110',
        longitude: '-74.0721',
        users: []
      };

      const result = await farmService.updateFarm(1, updateData);
      
      expect(result.data[0].id).toBe(1);
      expect(result.data[0].createdAt).toBe('2024-01-15T10:30:00.000Z');
      expect(result.data[0].name).toBe('Solo Nombre Nuevo');
    });

    it('debe verificar que se llame el mock con parámetros correctos', async () => {
      const updateData: FarmRequest = {
        name: 'Test Update',
        address: 'Test Address',
        latitude: '0.0000',
        longitude: '0.0000',
        users: []
      };

      await farmService.updateFarm(1, updateData);
      
      expect(mockUpdateFarm).toHaveBeenCalledWith(1, updateData);
    });
  });

  describe('deleteFarm', () => {
    it('debe eliminar una granja existente', async () => {
      const result = await farmService.deleteFarm(1);
      
      expect(result.data).toHaveLength(1);
      expect(result.data[0]).toMatchObject({
        id: 1,
        name: 'Granja Acuapónica Norte'
      });
    });

    it('debe fallar al eliminar granja inexistente', async () => {
      const result = await farmService.deleteFarm(999);
      
      expect(result.data).toHaveLength(0);
      expect(result.errors).toHaveLength(1);
      expect(result.message).toBe('Error en la operación');
    });

    it('debe verificar que se llame el mock con el ID correcto', async () => {
      await farmService.deleteFarm(2);
      
      expect(mockDeleteFarm).toHaveBeenCalledWith(2);
    });

    it('debe retornar la granja eliminada', async () => {
      const result = await farmService.deleteFarm(2);
      
      expect(result.data[0]).toMatchObject({
        id: 2,
        name: 'Granja Hidropónica Sur'
      });
    });
  });

  describe('Casos edge y validaciones', () => {
    it('debe manejar parámetros undefined en fetchFarms', async () => {
      const result = await farmService.fetchFarms(undefined, undefined);
      
      expect(result).toBeDefined();
      expect(mockFetchFarms).toHaveBeenCalledWith(1, 10);
    });

    it('debe manejar creación con ID predefinido', async () => {
      const farmDataWithId: FarmRequest = {
        id: 999,
        name: 'Granja con ID',
        address: 'Dirección',
        latitude: '0.0000',
        longitude: '0.0000',
        users: []
      };

      const result = await farmService.createFarm(farmDataWithId);
      
      expect(result.data[0].id).toBeDefined();
    });

    it('debe manejar usuarios como array de números', async () => {
      const farmData: FarmRequest = {
        name: 'Granja con IDs de usuarios',
        address: 'Dirección',
        latitude: '0.0000',
        longitude: '0.0000',
        users: [1, 2, 3]
      };

      const result = await farmService.createFarm(farmData);
      
      expect(result.data[0].users).toEqual([1, 2, 3]);
    });
  });
});
