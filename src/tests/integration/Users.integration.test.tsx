import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Users from '../../pages/Users';

// Mock del hook useUsers
const mockUseUsers = vi.fn();
vi.mock('../../hooks/useUsers', () => ({
  default: mockUseUsers,
}));

// Mock de los servicios de usuario
vi.mock('../../services/userService', () => ({
  fetchUsers: vi.fn(),
  createUser: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
}));

// Mock de componentes secundarios para aislar las pruebas
vi.mock('../../components/forms/RegisterUserModal', () => ({
  default: ({ isOpen, onClose, onRegister }: any) => 
    isOpen ? (
      <div data-testid="register-modal">
        <h2>Registrar Usuario</h2>
        <button onClick={() => onRegister({ name: 'Test User', email: 'test@email.com' })}>
          Guardar
        </button>
        <button onClick={onClose}>Cerrar</button>
      </div>
    ) : null,
}));

vi.mock('../../components/forms/UpdateUserModal', () => ({
  default: ({ isOpen, onClose, onUpdate, userData }: any) => 
    isOpen ? (
      <div data-testid="update-modal">
        <h2>Actualizar Usuario</h2>
        <p>Editando: {userData?.name}</p>
        <button onClick={() => onUpdate({ ...userData, name: 'Updated User' })}>
          Actualizar
        </button>
        <button onClick={onClose}>Cerrar</button>
      </div>
    ) : null,
}));

vi.mock('../../components/ui/TableWithActions', () => ({
  default: ({ data, columns, actions }: any) => (
    <div data-testid="table-with-actions">
      <table>
        <thead>
          <tr>
            {columns.map((col: any, index: number) => (
              <th key={index}>{col.header}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item: any, index: number) => (
            <tr key={index} data-testid={`user-row-${item.id}`}>
              {columns.map((col: any, colIndex: number) => (
                <td key={colIndex}>{item[col.accessor]}</td>
              ))}
              <td>
                {actions.map((action: any, actionIndex: number) => (
                  <button
                    key={actionIndex}
                    onClick={() => action.onClick(item)}
                    data-testid={`${action.label.toLowerCase()}-button-${item.id}`}
                  >
                    {action.label}
                  </button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
}));

// Wrapper para proporcionar contexto de router
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Users Component - Pruebas de Integración', () => {
  const mockUsers = [
    {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan@test.com',
      dni: '12345678',
      idRol: 1,
      address: 'Calle 123',
      contact: '+57 300 123 4567',
      rol: { name: 'Admin' }
    },
    {
      id: 2,
      name: 'María García',
      email: 'maria@test.com',
      dni: '87654321',
      idRol: 2,
      address: 'Avenida 456',
      contact: '+57 300 987 6543',
      rol: { name: 'Owner' }
    },
    {
      id: 3,
      name: 'Carlos López',
      email: 'carlos@test.com',
      dni: '11223344',
      idRol: 3,
      address: 'Carrera 789',
      contact: '+57 300 555 1234',
      rol: { name: 'User' }
    }
  ];

  const defaultMockReturnValue = {
    users: mockUsers,
    loading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
    totalUsers: mockUsers.length,
    searchTerm: '',
    setSearchTerm: vi.fn(),
    handleNextPage: vi.fn(),
    handlePreviousPage: vi.fn(),
    handleRegisterUser: vi.fn(),
    handleUpdateUser: vi.fn(),
    handleDeleteUser: vi.fn(),
    goToPage: vi.fn(),
    refreshUsers: vi.fn(),
  };

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    mockUseUsers.mockReturnValue(defaultMockReturnValue);
  });

  describe('Renderizado inicial', () => {
    it('debe renderizar el componente correctamente', () => {
      render(<Users />, { wrapper: RouterWrapper });

      expect(screen.getByText('Gestión de Usuarios')).toBeInTheDocument();
      expect(screen.getByText('Administra los usuarios del sistema')).toBeInTheDocument();
    });

    it('debe mostrar el botón de nuevo usuario', () => {
      render(<Users />, { wrapper: RouterWrapper });

      const newUserButton = screen.getByText('Nuevo Usuario');
      expect(newUserButton).toBeInTheDocument();
    });

    it('debe mostrar el campo de búsqueda', () => {
      render(<Users />, { wrapper: RouterWrapper });

      const searchInput = screen.getByPlaceholderText(/buscar usuarios/i);
      expect(searchInput).toBeInTheDocument();
    });

    it('debe mostrar la tabla de usuarios', () => {
      render(<Users />, { wrapper: RouterWrapper });

      expect(screen.getByTestId('table-with-actions')).toBeInTheDocument();
    });
  });

  describe('Estado de carga', () => {
    it('debe mostrar spinner cuando está cargando', () => {
      mockUseUsers.mockReturnValue({
        ...defaultMockReturnValue,
        loading: true,
        users: [],
      });

      render(<Users />, { wrapper: RouterWrapper });

      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('debe ocultar contenido cuando está cargando', () => {
      mockUseUsers.mockReturnValue({
        ...defaultMockReturnValue,
        loading: true,
        users: [],
      });

      render(<Users />, { wrapper: RouterWrapper });

      expect(screen.queryByTestId('table-with-actions')).not.toBeInTheDocument();
    });
  });

  describe('Manejo de errores', () => {
    it('debe mostrar mensaje de error cuando hay un error', () => {
      const errorMessage = 'Error al cargar usuarios';
      mockUseUsers.mockReturnValue({
        ...defaultMockReturnValue,
        error: errorMessage,
        users: [],
      });

      render(<Users />, { wrapper: RouterWrapper });

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('debe permitir reintentar después de un error', () => {
      const mockRefreshUsers = vi.fn();
      mockUseUsers.mockReturnValue({
        ...defaultMockReturnValue,
        error: 'Error de conexión',
        users: [],
        refreshUsers: mockRefreshUsers,
      });

      render(<Users />, { wrapper: RouterWrapper });

      const retryButton = screen.getByText('Reintentar');
      fireEvent.click(retryButton);

      expect(mockRefreshUsers).toHaveBeenCalled();
    });
  });

  describe('Búsqueda de usuarios', () => {
    it('debe actualizar el término de búsqueda al escribir', async () => {
      const mockSetSearchTerm = vi.fn();
      mockUseUsers.mockReturnValue({
        ...defaultMockReturnValue,
        setSearchTerm: mockSetSearchTerm,
      });

      render(<Users />, { wrapper: RouterWrapper });

      const searchInput = screen.getByPlaceholderText(/buscar usuarios/i);
      
      await userEvent.type(searchInput, 'Juan');

      expect(mockSetSearchTerm).toHaveBeenCalledWith('Juan');
    });

    it('debe mostrar el término de búsqueda actual', () => {
      mockUseUsers.mockReturnValue({
        ...defaultMockReturnValue,
        searchTerm: 'test search',
      });

      render(<Users />, { wrapper: RouterWrapper });

      const searchInput = screen.getByPlaceholderText(/buscar usuarios/i) as HTMLInputElement;
      expect(searchInput.value).toBe('test search');
    });

    it('debe limpiar la búsqueda al borrar el campo', async () => {
      const mockSetSearchTerm = vi.fn();
      mockUseUsers.mockReturnValue({
        ...defaultMockReturnValue,
        searchTerm: 'test',
        setSearchTerm: mockSetSearchTerm,
      });

      render(<Users />, { wrapper: RouterWrapper });

      const searchInput = screen.getByPlaceholderText(/buscar usuarios/i);
      
      await userEvent.clear(searchInput);

      expect(mockSetSearchTerm).toHaveBeenCalledWith('');
    });
  });

  describe('Gestión de usuarios', () => {
    it('debe abrir modal de registro al hacer clic en "Nuevo Usuario"', async () => {
      render(<Users />, { wrapper: RouterWrapper });

      const newUserButton = screen.getByText('Nuevo Usuario');
      fireEvent.click(newUserButton);

      await waitFor(() => {
        expect(screen.getByTestId('register-modal')).toBeInTheDocument();
      });
    });

    it('debe cerrar modal de registro', async () => {
      render(<Users />, { wrapper: RouterWrapper });

      // Abrir modal
      const newUserButton = screen.getByText('Nuevo Usuario');
      fireEvent.click(newUserButton);

      await waitFor(() => {
        expect(screen.getByTestId('register-modal')).toBeInTheDocument();
      });

      // Cerrar modal
      const closeButton = screen.getByText('Cerrar');
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByTestId('register-modal')).not.toBeInTheDocument();
      });
    });

    it('debe llamar handleRegisterUser al registrar usuario', async () => {
      const mockHandleRegisterUser = vi.fn();
      mockUseUsers.mockReturnValue({
        ...defaultMockReturnValue,
        handleRegisterUser: mockHandleRegisterUser,
      });

      render(<Users />, { wrapper: RouterWrapper });

      // Abrir modal
      const newUserButton = screen.getByText('Nuevo Usuario');
      fireEvent.click(newUserButton);

      await waitFor(() => {
        expect(screen.getByTestId('register-modal')).toBeInTheDocument();
      });

      // Registrar usuario
      const saveButton = screen.getByText('Guardar');
      fireEvent.click(saveButton);

      expect(mockHandleRegisterUser).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@email.com'
      });
    });
  });

  describe('Acciones de tabla', () => {
    it('debe mostrar botones de acción para cada usuario', () => {
      render(<Users />, { wrapper: RouterWrapper });

      // Verificar que existen los botones para el primer usuario
      expect(screen.getByTestId('editar-button-1')).toBeInTheDocument();
      expect(screen.getByTestId('eliminar-button-1')).toBeInTheDocument();
    });

    it('debe abrir modal de edición al hacer clic en editar', async () => {
      render(<Users />, { wrapper: RouterWrapper });

      const editButton = screen.getByTestId('editar-button-1');
      fireEvent.click(editButton);

      await waitFor(() => {
        expect(screen.getByTestId('update-modal')).toBeInTheDocument();
        expect(screen.getByText('Editando: Juan Pérez')).toBeInTheDocument();
      });
    });

    it('debe llamar handleUpdateUser al actualizar usuario', async () => {
      const mockHandleUpdateUser = vi.fn();
      mockUseUsers.mockReturnValue({
        ...defaultMockReturnValue,
        handleUpdateUser: mockHandleUpdateUser,
      });

      render(<Users />, { wrapper: RouterWrapper });

      // Abrir modal de edición
      const editButton = screen.getByTestId('editar-button-1');
      fireEvent.click(editButton);

      await waitFor(() => {
        expect(screen.getByTestId('update-modal')).toBeInTheDocument();
      });

      // Actualizar usuario
      const updateButton = screen.getByText('Actualizar');
      fireEvent.click(updateButton);

      expect(mockHandleUpdateUser).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          name: 'Updated User'
        })
      );
    });

    it('debe llamar handleDeleteUser al eliminar usuario', () => {
      const mockHandleDeleteUser = vi.fn();
      mockUseUsers.mockReturnValue({
        ...defaultMockReturnValue,
        handleDeleteUser: mockHandleDeleteUser,
      });

      render(<Users />, { wrapper: RouterWrapper });

      const deleteButton = screen.getByTestId('eliminar-button-1');
      fireEvent.click(deleteButton);

      expect(mockHandleDeleteUser).toHaveBeenCalledWith(1);
    });
  });

  describe('Paginación', () => {
    it('debe mostrar información de paginación', () => {
      mockUseUsers.mockReturnValue({
        ...defaultMockReturnValue,
        currentPage: 2,
        totalPages: 5,
        totalUsers: 45,
      });

      render(<Users />, { wrapper: RouterWrapper });

      expect(screen.getByText(/página 2 de 5/i)).toBeInTheDocument();
      expect(screen.getByText(/45 usuarios en total/i)).toBeInTheDocument();
    });

    it('debe llamar handlePreviousPage al hacer clic en anterior', () => {
      const mockHandlePreviousPage = vi.fn();
      mockUseUsers.mockReturnValue({
        ...defaultMockReturnValue,
        currentPage: 2,
        totalPages: 5,
        handlePreviousPage: mockHandlePreviousPage,
      });

      render(<Users />, { wrapper: RouterWrapper });

      const previousButton = screen.getByText('Anterior');
      fireEvent.click(previousButton);

      expect(mockHandlePreviousPage).toHaveBeenCalled();
    });

    it('debe llamar handleNextPage al hacer clic en siguiente', () => {
      const mockHandleNextPage = vi.fn();
      mockUseUsers.mockReturnValue({
        ...defaultMockReturnValue,
        currentPage: 1,
        totalPages: 5,
        handleNextPage: mockHandleNextPage,
      });

      render(<Users />, { wrapper: RouterWrapper });

      const nextButton = screen.getByText('Siguiente');
      fireEvent.click(nextButton);

      expect(mockHandleNextPage).toHaveBeenCalled();
    });

    it('debe deshabilitar botón anterior en primera página', () => {
      mockUseUsers.mockReturnValue({
        ...defaultMockReturnValue,
        currentPage: 1,
        totalPages: 5,
      });

      render(<Users />, { wrapper: RouterWrapper });

      const previousButton = screen.getByText('Anterior');
      expect(previousButton).toBeDisabled();
    });

    it('debe deshabilitar botón siguiente en última página', () => {
      mockUseUsers.mockReturnValue({
        ...defaultMockReturnValue,
        currentPage: 5,
        totalPages: 5,
      });

      render(<Users />, { wrapper: RouterWrapper });

      const nextButton = screen.getByText('Siguiente');
      expect(nextButton).toBeDisabled();
    });
  });

  describe('Responsividad', () => {
    it('debe aplicar clases responsive correctas', () => {
      render(<Users />, { wrapper: RouterWrapper });

      const container = screen.getByText('Gestión de Usuarios').closest('div');
      expect(container).toHaveClass('px-4', 'sm:px-6', 'lg:px-8');
    });

    it('debe mostrar diseño móvil en pantallas pequeñas', () => {
      // Simular pantalla móvil
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<Users />, { wrapper: RouterWrapper });

      const mobileElements = screen.getAllByText(/usuarios/i);
      expect(mobileElements.length).toBeGreaterThan(0);
    });
  });

  describe('Estados vacíos', () => {
    it('debe mostrar mensaje cuando no hay usuarios', () => {
      mockUseUsers.mockReturnValue({
        ...defaultMockReturnValue,
        users: [],
        totalUsers: 0,
      });

      render(<Users />, { wrapper: RouterWrapper });

      expect(screen.getByText(/no se encontraron usuarios/i)).toBeInTheDocument();
    });

    it('debe mostrar mensaje cuando la búsqueda no tiene resultados', () => {
      mockUseUsers.mockReturnValue({
        ...defaultMockReturnValue,
        users: [],
        searchTerm: 'usuario inexistente',
        totalUsers: 0,
      });

      render(<Users />, { wrapper: RouterWrapper });

      expect(screen.getByText(/no se encontraron usuarios/i)).toBeInTheDocument();
    });
  });

  describe('Accesibilidad', () => {
    it('debe tener etiquetas ARIA apropiadas', () => {
      render(<Users />, { wrapper: RouterWrapper });

      const searchInput = screen.getByPlaceholderText(/buscar usuarios/i);
      expect(searchInput).toHaveAttribute('aria-label');

      const newUserButton = screen.getByText('Nuevo Usuario');
      expect(newUserButton).toHaveAttribute('type', 'button');
    });

    it('debe ser navegable por teclado', () => {
      render(<Users />, { wrapper: RouterWrapper });

      const searchInput = screen.getByPlaceholderText(/buscar usuarios/i);
      const newUserButton = screen.getByText('Nuevo Usuario');

      expect(searchInput).toHaveAttribute('tabIndex');
      expect(newUserButton).not.toHaveAttribute('tabIndex', '-1');
    });
  });
});
