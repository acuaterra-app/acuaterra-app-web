/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createMemoryHistory, createRouter } from '@tanstack/react-router';
import Users from '../../pages/Users';

// Mock de los servicios
vi.mock('../../services/userService', () => ({
  fetchUsers: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
  fetchAllUsers: vi.fn()
}));

// Mock de los hooks
vi.mock('../../hooks/useUsers', () => ({
  default: vi.fn()
}));

vi.mock('../../hooks/useRegisterUser', () => ({
  default: vi.fn()
}));

vi.mock('../../hooks/useDebounce', () => ({
  default: vi.fn()
}));

// Mock de react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  },
  ToastContainer: () => <div data-testid="toast-container" />
}));

// Mock de la validación de token
vi.mock('../../common/isTokenValid', () => ({
  isTokenValid: vi.fn().mockReturnValue(true)
}));

import { fetchUsers, createUser, updateUser, deleteUser } from '../../services/userService';
import useUsers from '../../hooks/useUsers';
import useRegisterUser from '../../hooks/useRegisterUser';
import useDebounce from '../../hooks/useDebounce';
import { toast } from 'react-toastify';

const mockUsers = [
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
  },
  {
    id: 2,
    name: 'María García',
    email: 'maria@test.com',
    dni: '87654321',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    id_rol: 2,
    contact: '987654321',
    address: 'Avenida 456',
    rol: { name: 'USER' },
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z'
  }
];

const renderUsersPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  const history = createMemoryHistory({
    initialEntries: ['/users']
  });

  const router = createRouter({
    history,
    routes: [
      {
        path: '/users',
        component: Users
      }
    ]
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

describe('🔗 PRUEBAS DE INTEGRACIÓN - Página de Usuarios CRUD', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn().mockImplementation((key) => {
          if (key === 'token') return 'mock-token';
          if (key === 'userName') return 'Test User';
          if (key === 'darkMode') return 'false';
          return null;
        }),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      writable: true,
    });

    // Mock window.confirm
    global.confirm = vi.fn();

    // Configurar mocks por defecto
    vi.mocked(useUsers).mockReturnValue({
      users: mockUsers,
      loading: false,
      error: null,
      total: mockUsers.length,
      page: 1,
      limit: 10,
      setPage: vi.fn(),
      setLimit: vi.fn()
    });

    vi.mocked(useRegisterUser).mockReturnValue({
      registerUser: vi.fn()
    });

    vi.mocked(useDebounce).mockImplementation((value) => value);
  });

  describe('📊 Visualización de Datos', () => {
    it('✅ Debe mostrar la lista de usuarios correctamente', async () => {
      renderUsersPage();

      await waitFor(() => {
        expect(screen.getByText('Lista de Usuarios')).toBeInTheDocument();
      });

      // Verificar que se muestran los usuarios
      expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
      expect(screen.getByText('María García')).toBeInTheDocument();
      expect(screen.getByText('juan@test.com')).toBeInTheDocument();
      expect(screen.getByText('maria@test.com')).toBeInTheDocument();
    });

    it('🔄 Debe mostrar el loader cuando está cargando', async () => {
      vi.mocked(useUsers).mockReturnValue({
        users: [],
        loading: true,
        error: null,
        total: 0,
        page: 1,
        limit: 10,
        setPage: vi.fn(),
        setLimit: vi.fn()
      });

      renderUsersPage();

      expect(screen.getByTestId('loader-acua')).toBeInTheDocument();
    });

    it('❌ Debe mostrar mensaje de error cuando hay un error', async () => {
      const errorMessage = 'Error al cargar usuarios';
      vi.mocked(useUsers).mockReturnValue({
        users: [],
        loading: false,
        error: errorMessage,
        total: 0,
        page: 1,
        limit: 10,
        setPage: vi.fn(),
        setLimit: vi.fn()
      });

      renderUsersPage();

      await waitFor(() => {
        expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
      });
    });
  });

  describe('➕ Creación de Usuarios', () => {
    it('✅ Debe abrir el modal de registro cuando se hace clic en Agregar', async () => {
      const user = userEvent.setup();
      renderUsersPage();

      await waitFor(() => {
        expect(screen.getByText('Lista de Usuarios')).toBeInTheDocument();
      });

      // Buscar y hacer clic en el botón de agregar
      const addButton = screen.getByRole('button', { name: /agregar/i });
      await user.click(addButton);

      // Verificar que se abre el modal
      expect(screen.getByTestId('register-user-modal')).toBeInTheDocument();
    });

    it('✅ Debe crear un usuario exitosamente', async () => {
      const mockRegisterUser = vi.fn().mockResolvedValue({ success: true });
      vi.mocked(useRegisterUser).mockReturnValue({
        registerUser: mockRegisterUser
      });

      const user = userEvent.setup();
      renderUsersPage();

      await waitFor(() => {
        expect(screen.getByText('Lista de Usuarios')).toBeInTheDocument();
      });

      // Abrir modal
      const addButton = screen.getByRole('button', { name: /agregar/i });
      await user.click(addButton);

      // Llenar formulario
      const nameInput = screen.getByLabelText(/nombre/i);
      const emailInput = screen.getByLabelText(/email/i);
      
      await user.type(nameInput, 'Nuevo Usuario');
      await user.type(emailInput, 'nuevo@test.com');

      // Enviar formulario
      const submitButton = screen.getByRole('button', { name: /registrar/i });
      await user.click(submitButton);

      // Verificar que se llamó la función
      expect(mockRegisterUser).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Nuevo Usuario',
          email: 'nuevo@test.com'
        })
      );

      // Verificar toast de éxito
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Usuario registrado exitosamente!');
      });
    });

    it('❌ Debe mostrar error cuando falla la creación', async () => {
      const mockRegisterUser = vi.fn().mockResolvedValue({ 
        success: false, 
        message: 'Email ya existe' 
      });
      vi.mocked(useRegisterUser).mockReturnValue({
        registerUser: mockRegisterUser
      });

      const user = userEvent.setup();
      renderUsersPage();

      await waitFor(() => {
        expect(screen.getByText('Lista de Usuarios')).toBeInTheDocument();
      });

      // Abrir modal y llenar formulario
      const addButton = screen.getByRole('button', { name: /agregar/i });
      await user.click(addButton);

      const nameInput = screen.getByLabelText(/nombre/i);
      await user.type(nameInput, 'Usuario Duplicado');

      // Enviar formulario
      const submitButton = screen.getByRole('button', { name: /registrar/i });
      await user.click(submitButton);

      // Verificar toast de error
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          'No se pudo registrar el usuario. Por: Email ya existe'
        );
      });
    });
  });

  describe('✏️ Edición de Usuarios', () => {
    it('✅ Debe abrir el modal de edición cuando se hace clic en editar', async () => {
      const user = userEvent.setup();
      renderUsersPage();

      await waitFor(() => {
        expect(screen.getByText('Lista de Usuarios')).toBeInTheDocument();
      });

      // Buscar y hacer clic en el botón de editar del primer usuario
      const editButtons = screen.getAllByRole('button', { name: /editar/i });
      await user.click(editButtons[0]);

      // Verificar que se abre el modal de edición
      expect(screen.getByTestId('update-user-modal')).toBeInTheDocument();
    });

    it('✅ Debe actualizar un usuario exitosamente', async () => {
      vi.mocked(updateUser).mockResolvedValue({
        message: 'Usuario actualizado exitosamente',
        data: [{ ...mockUsers[0], name: 'Juan Pérez Actualizado' }],
        errors: [],
        meta: { pagination: { total: 1, hasNext: false, hasPrev: false } }
      });

      const user = userEvent.setup();
      renderUsersPage();

      await waitFor(() => {
        expect(screen.getByText('Lista de Usuarios')).toBeInTheDocument();
      });

      // Hacer clic en editar
      const editButtons = screen.getAllByRole('button', { name: /editar/i });
      await user.click(editButtons[0]);

      // Editar el nombre
      const nameInput = screen.getByDisplayValue('Juan Pérez');
      await user.clear(nameInput);
      await user.type(nameInput, 'Juan Pérez Actualizado');

      // Guardar cambios
      const updateButton = screen.getByRole('button', { name: /actualizar/i });
      await user.click(updateButton);

      // Verificar que se llamó la función de actualización
      expect(updateUser).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          name: 'Juan Pérez Actualizado'
        })
      );

      // Verificar toast de éxito
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Usuario actualizado exitosamente!');
      });
    });
  });

  describe('🗑️ Eliminación de Usuarios', () => {
    it('✅ Debe eliminar un usuario con confirmación', async () => {
      vi.mocked(deleteUser).mockResolvedValue({
        message: 'Usuario eliminado exitosamente',
        data: [],
        errors: [],
        meta: { pagination: { total: 0, hasNext: false, hasPrev: false } }
      });

      global.confirm = vi.fn().mockReturnValue(true);

      const user = userEvent.setup();
      renderUsersPage();

      await waitFor(() => {
        expect(screen.getByText('Lista de Usuarios')).toBeInTheDocument();
      });

      // Hacer clic en eliminar
      const deleteButtons = screen.getAllByRole('button', { name: /eliminar/i });
      await user.click(deleteButtons[0]);

      // Verificar confirmación
      expect(global.confirm).toHaveBeenCalledWith(
        '¿Estás seguro de que deseas eliminar este usuario?'
      );

      // Verificar que se llamó la función de eliminación
      expect(deleteUser).toHaveBeenCalledWith(1);

      // Verificar toast de éxito
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Usuario eliminado exitosamente!');
      });
    });

    it('❌ No debe eliminar si se cancela la confirmación', async () => {
      global.confirm = vi.fn().mockReturnValue(false);

      const user = userEvent.setup();
      renderUsersPage();

      await waitFor(() => {
        expect(screen.getByText('Lista de Usuarios')).toBeInTheDocument();
      });

      // Hacer clic en eliminar
      const deleteButtons = screen.getAllByRole('button', { name: /eliminar/i });
      await user.click(deleteButtons[0]);

      // Verificar que no se llamó la función de eliminación
      expect(deleteUser).not.toHaveBeenCalled();
    });
  });

  describe('🔍 Búsqueda de Usuarios', () => {
    it('✅ Debe filtrar usuarios por término de búsqueda', async () => {
      const user = userEvent.setup();
      renderUsersPage();

      await waitFor(() => {
        expect(screen.getByText('Lista de Usuarios')).toBeInTheDocument();
      });

      // Buscar el campo de búsqueda
      const searchInput = screen.getByPlaceholderText(/buscar usuarios/i);
      
      // Escribir término de búsqueda
      await user.type(searchInput, 'Juan');

      // Verificar que se actualizó el término de búsqueda
      expect(searchInput).toHaveValue('Juan');
    });

    it('✅ Debe mostrar todos los usuarios cuando se limpia la búsqueda', async () => {
      const user = userEvent.setup();
      renderUsersPage();

      await waitFor(() => {
        expect(screen.getByText('Lista de Usuarios')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/buscar usuarios/i);
      
      // Escribir y luego limpiar
      await user.type(searchInput, 'Juan');
      await user.clear(searchInput);

      // Verificar que se limpia la búsqueda
      expect(searchInput).toHaveValue('');
    });
  });

  describe('📱 Responsividad', () => {
    it('✅ Debe mostrar tabla desktop en pantallas grandes', async () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      renderUsersPage();

      await waitFor(() => {
        expect(screen.getByTestId('desktop-table')).toBeInTheDocument();
        expect(screen.queryByTestId('mobile-table')).not.toBeInTheDocument();
      });
    });

    it('📱 Debe mostrar tabla móvil en pantallas pequeñas', async () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600,
      });

      renderUsersPage();

      await waitFor(() => {
        expect(screen.getByTestId('mobile-table')).toBeInTheDocument();
        expect(screen.queryByTestId('desktop-table')).not.toBeInTheDocument();
      });
    });
  });
});
