import { test, expect, type Page } from '@playwright/test';

// Configuración de datos de prueba
const testUser = {
  name: 'Usuario de Prueba E2E',
  email: 'usuario.e2e@test.com',
  dni: '12345678',
  address: 'Calle Test 123',
  contact: '+57 300 123 4567',
  idRol: 3
};

const updatedUser = {
  name: 'Usuario Actualizado E2E',
  email: 'usuario.actualizado.e2e@test.com',
  dni: '87654321',
  address: 'Avenida Test 456',
  contact: '+57 300 987 6543',
  idRol: 2
};

// Función auxiliar para navegar a usuarios
async function navigateToUsers(page: Page): Promise<void> {
  await page.goto('/users');
  await page.waitForLoadState('networkidle');
}

test.describe('Users CRUD - Pruebas End-to-End', () => {
  test.beforeEach(async ({ page }) => {
    // Configurar timeouts
    page.setDefaultTimeout(10000);
    page.setDefaultNavigationTimeout(10000);
    
    // Realizar login si es necesario
    // await login(page);
    
    // Navegar a la página de usuarios
    await navigateToUsers(page);
  });

  test.describe('Navegación y estructura inicial', () => {
    test('debe cargar la página de usuarios correctamente', async ({ page }) => {
      // Verificar que el título esté presente
      await expect(page.locator('h1')).toContainText('Gestión de Usuarios');
      
      // Verificar elementos principales
      await expect(page.locator('[data-testid="search-input"]')).toBeVisible();
      await expect(page.locator('[data-testid="new-user-button"]')).toBeVisible();
      await expect(page.locator('[data-testid="users-table"]')).toBeVisible();
    });

    test('debe mostrar la estructura de la tabla correctamente', async ({ page }) => {
      // Verificar headers de la tabla
      const headers = ['Nombre', 'Email', 'DNI', 'Rol', 'Contacto', 'Acciones'];
      
      for (const header of headers) {
        await expect(page.locator('th')).toContainText(header);
      }
    });

    test('debe mostrar información de paginación', async ({ page }) => {
      // Verificar que existe información de paginación
      await expect(page.locator('[data-testid="pagination-info"]')).toBeVisible();
      
      // Verificar controles de paginación
      await expect(page.locator('[data-testid="previous-button"]')).toBeVisible();
      await expect(page.locator('[data-testid="next-button"]')).toBeVisible();
    });
  });

  test.describe('Funcionalidad de búsqueda', () => {
    test('debe filtrar usuarios por nombre', async ({ page }) => {
      // Obtener el número inicial de filas
      const initialRows = await page.locator('[data-testid^="user-row-"]').count();
      
      // Realizar búsqueda
      await page.fill('[data-testid="search-input"]', 'Juan');
      await page.waitForTimeout(1000); // Esperar debounce
      
      // Verificar que los resultados se filtraron
      const filteredRows = await page.locator('[data-testid^="user-row-"]').count();
      
      // Si hay usuarios que coinciden, debe haber menos filas o las mismas
      expect(filteredRows).toBeLessThanOrEqual(initialRows);
      
      // Verificar que las filas visibles contienen el término buscado
      const visibleRows = await page.locator('[data-testid^="user-row-"]').all();
      for (const row of visibleRows) {
        const rowText = await row.textContent();
        expect(rowText?.toLowerCase()).toContain('juan');
      }
    });

    test('debe mostrar mensaje cuando no hay resultados', async ({ page }) => {
      // Buscar algo que no existe
      await page.fill('[data-testid="search-input"]', 'UsuarioInexistente123456');
      await page.waitForTimeout(1000);
      
      // Verificar mensaje de no resultados
      await expect(page.locator('[data-testid="no-results-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="no-results-message"]')).toContainText('No se encontraron usuarios');
    });

    test('debe limpiar la búsqueda correctamente', async ({ page }) => {
      // Realizar búsqueda
      await page.fill('[data-testid="search-input"]', 'test');
      await page.waitForTimeout(1000);
      
      // Limpiar búsqueda
      await page.fill('[data-testid="search-input"]', '');
      await page.waitForTimeout(1000);
      
      // Verificar que se muestran todos los usuarios
      const searchInput = page.locator('[data-testid="search-input"]');
      await expect(searchInput).toHaveValue('');
    });
  });

  test.describe('Crear usuario', () => {
    test('debe abrir el modal de registro', async ({ page }) => {
      // Hacer click en nuevo usuario
      await page.click('[data-testid="new-user-button"]');
      
      // Verificar que el modal se abre
      await expect(page.locator('[data-testid="register-modal"]')).toBeVisible();
      await expect(page.locator('[data-testid="modal-title"]')).toContainText('Registrar Usuario');
    });

    test('debe cerrar el modal de registro', async ({ page }) => {
      // Abrir modal
      await page.click('[data-testid="new-user-button"]');
      await expect(page.locator('[data-testid="register-modal"]')).toBeVisible();
      
      // Cerrar modal
      await page.click('[data-testid="close-modal-button"]');
      
      // Verificar que el modal se cierra
      await expect(page.locator('[data-testid="register-modal"]')).not.toBeVisible();
    });

    test('debe crear un nuevo usuario exitosamente', async ({ page }) => {
      // Abrir modal de registro
      await page.click('[data-testid="new-user-button"]');
      
      // Completar formulario
      await page.fill('[data-testid="name-input"]', testUser.name);
      await page.fill('[data-testid="email-input"]', testUser.email);
      await page.fill('[data-testid="dni-input"]', testUser.dni);
      await page.fill('[data-testid="address-input"]', testUser.address);
      await page.fill('[data-testid="contact-input"]', testUser.contact);
      await page.selectOption('[data-testid="role-select"]', testUser.idRol.toString());
      
      // Enviar formulario
      await page.click('[data-testid="submit-button"]');
      
      // Verificar que el modal se cierra
      await expect(page.locator('[data-testid="register-modal"]')).not.toBeVisible();
      
      // Verificar notificación de éxito
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="success-message"]')).toContainText('Usuario creado exitosamente');
      
      // Verificar que el usuario aparece en la tabla
      await expect(page.locator(`text=${testUser.name}`)).toBeVisible();
      await expect(page.locator(`text=${testUser.email}`)).toBeVisible();
    });

    test('debe validar campos requeridos', async ({ page }) => {
      // Abrir modal
      await page.click('[data-testid="new-user-button"]');
      
      // Intentar enviar formulario vacío
      await page.click('[data-testid="submit-button"]');
      
      // Verificar mensajes de validación
      await expect(page.locator('[data-testid="name-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="dni-error"]')).toBeVisible();
    });

    test('debe validar formato de email', async ({ page }) => {
      // Abrir modal
      await page.click('[data-testid="new-user-button"]');
      
      // Completar con email inválido
      await page.fill('[data-testid="name-input"]', 'Test User');
      await page.fill('[data-testid="email-input"]', 'email-invalido');
      await page.fill('[data-testid="dni-input"]', '12345678');
      
      // Intentar enviar
      await page.click('[data-testid="submit-button"]');
      
      // Verificar error de validación
      await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
      await expect(page.locator('[data-testid="email-error"]')).toContainText('Email inválido');
    });
  });

  test.describe('Actualizar usuario', () => {
    test('debe abrir el modal de edición', async ({ page }) => {
      // Hacer click en el botón de editar del primer usuario
      await page.click('[data-testid^="edit-button-"]:first-child');
      
      // Verificar que el modal se abre
      await expect(page.locator('[data-testid="update-modal"]')).toBeVisible();
      await expect(page.locator('[data-testid="modal-title"]')).toContainText('Actualizar Usuario');
    });

    test('debe pre-llenar el formulario con datos del usuario', async ({ page }) => {
      // Hacer click en editar
      await page.click('[data-testid^="edit-button-"]:first-child');
      
      // Verificar que los campos están pre-llenados
      const nameInput = page.locator('[data-testid="name-input"]');
      const emailInput = page.locator('[data-testid="email-input"]');
      const dniInput = page.locator('[data-testid="dni-input"]');
      
      await expect(nameInput).not.toHaveValue('');
      await expect(emailInput).not.toHaveValue('');
      await expect(dniInput).not.toHaveValue('');
    });

    test('debe actualizar un usuario exitosamente', async ({ page }) => {
      // Hacer click en editar
      await page.click('[data-testid^="edit-button-"]:first-child');
      
      // Modificar datos
      await page.fill('[data-testid="name-input"]', updatedUser.name);
      await page.fill('[data-testid="email-input"]', updatedUser.email);
      await page.fill('[data-testid="address-input"]', updatedUser.address);
      
      // Enviar formulario
      await page.click('[data-testid="submit-button"]');
      
      // Verificar que el modal se cierra
      await expect(page.locator('[data-testid="update-modal"]')).not.toBeVisible();
      
      // Verificar notificación de éxito
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="success-message"]')).toContainText('Usuario actualizado exitosamente');
      
      // Verificar cambios en la tabla
      await expect(page.locator(`text=${updatedUser.name}`)).toBeVisible();
    });
  });

  test.describe('Eliminar usuario', () => {
    test('debe mostrar confirmación antes de eliminar', async ({ page }) => {
      // Hacer click en eliminar
      await page.click('[data-testid^="delete-button-"]:first-child');
      
      // Verificar modal de confirmación
      await expect(page.locator('[data-testid="confirmation-modal"]')).toBeVisible();
      await expect(page.locator('[data-testid="confirmation-message"]')).toContainText('¿Estás seguro');
    });

    test('debe cancelar eliminación', async ({ page }) => {
      // Hacer click en eliminar
      await page.click('[data-testid^="delete-button-"]:first-child');
      
      // Cancelar
      await page.click('[data-testid="cancel-button"]');
      
      // Verificar que el modal se cierra
      await expect(page.locator('[data-testid="confirmation-modal"]')).not.toBeVisible();
    });

    test('debe eliminar usuario exitosamente', async ({ page }) => {
      // Obtener el nombre del usuario a eliminar
      const userToDelete = await page.locator('[data-testid^="user-row-"]:first-child td:first-child').textContent();
      
      // Hacer click en eliminar
      await page.click('[data-testid^="delete-button-"]:first-child');
      
      // Confirmar eliminación
      await page.click('[data-testid="confirm-button"]');
      
      // Verificar notificación de éxito
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="success-message"]')).toContainText('Usuario eliminado exitosamente');
      
      // Verificar que el usuario ya no está en la tabla
      if (userToDelete) {
        await expect(page.locator(`text=${userToDelete}`)).not.toBeVisible();
      }
    });
  });

  test.describe('Paginación', () => {
    test('debe navegar entre páginas', async ({ page }) => {
      // Verificar página inicial
      await expect(page.locator('[data-testid="current-page"]')).toContainText('1');
      
      // Ir a página siguiente (si existe)
      const nextButton = page.locator('[data-testid="next-button"]');
      const isNextEnabled = await nextButton.isEnabled();
      
      if (isNextEnabled) {
        await nextButton.click();
        await page.waitForLoadState('networkidle');
        
        // Verificar cambio de página
        await expect(page.locator('[data-testid="current-page"]')).toContainText('2');
        
        // Volver a página anterior
        await page.click('[data-testid="previous-button"]');
        await page.waitForLoadState('networkidle');
        
        await expect(page.locator('[data-testid="current-page"]')).toContainText('1');
      }
    });

    test('debe deshabilitar botones de navegación apropiadamente', async ({ page }) => {
      // En la primera página, el botón anterior debe estar deshabilitado
      const previousButton = page.locator('[data-testid="previous-button"]');
      await expect(previousButton).toBeDisabled();
    });

    test('debe mostrar información correcta de paginación', async ({ page }) => {
      // Verificar que muestra información de usuarios
      const paginationInfo = page.locator('[data-testid="pagination-info"]');
      await expect(paginationInfo).toContainText(/usuarios/i);
      await expect(paginationInfo).toContainText(/página/i);
    });
  });

  test.describe('Responsividad', () => {
    test('debe adaptarse a pantalla móvil', async ({ page }) => {
      // Cambiar a viewport móvil
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Verificar que los elementos principales siguen siendo visibles
      await expect(page.locator('[data-testid="search-input"]')).toBeVisible();
      await expect(page.locator('[data-testid="new-user-button"]')).toBeVisible();
      
      // Verificar que la tabla se adapta o muestra una versión móvil
      const table = page.locator('[data-testid="users-table"]');
      await expect(table).toBeVisible();
    });

    test('debe mantener funcionalidad en tablet', async ({ page }) => {
      // Cambiar a viewport de tablet
      await page.setViewportSize({ width: 768, height: 1024 });
      
      // Verificar funcionalidad completa
      await expect(page.locator('[data-testid="search-input"]')).toBeVisible();
      await expect(page.locator('[data-testid="new-user-button"]')).toBeVisible();
      await expect(page.locator('[data-testid="users-table"]')).toBeVisible();
      
      // Probar que los modales funcionan correctamente
      await page.click('[data-testid="new-user-button"]');
      await expect(page.locator('[data-testid="register-modal"]')).toBeVisible();
    });
  });

  test.describe('Accesibilidad', () => {
    test('debe tener navegación por teclado funcional', async ({ page }) => {
      // Navegar con Tab
      await page.keyboard.press('Tab');
      await expect(page.locator('[data-testid="search-input"]')).toBeFocused();
      
      await page.keyboard.press('Tab');
      await expect(page.locator('[data-testid="new-user-button"]')).toBeFocused();
    });

    test('debe tener atributos ARIA apropiados', async ({ page }) => {
      // Verificar atributos ARIA en elementos importantes
      const searchInput = page.locator('[data-testid="search-input"]');
      await expect(searchInput).toHaveAttribute('aria-label');
      
      const table = page.locator('[data-testid="users-table"]');
      await expect(table).toHaveAttribute('role', 'table');
    });

    test('debe funcionar con lector de pantalla', async ({ page }) => {
      // Verificar que los elementos tienen texto descriptivo
      const newUserButton = page.locator('[data-testid="new-user-button"]');
      const buttonText = await newUserButton.textContent();
      expect(buttonText).toBeTruthy();
      expect(buttonText?.length).toBeGreaterThan(0);
    });
  });

  test.describe('Manejo de errores', () => {
    test('debe manejar errores de red graciosamente', async ({ page }) => {
      // Simular fallo de red
      await page.route('**/api/users**', route => route.abort());
      
      // Navegar a usuarios
      await page.reload();
      
      // Verificar mensaje de error
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="error-message"]')).toContainText(/error/i);
    });

    test('debe permitir reintentar después de error', async ({ page }) => {
      // Simular error inicial
      await page.route('**/api/users**', route => route.abort());
      await page.reload();
      
      // Verificar botón de reintento
      await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();
      
      // Remover intercepción de red
      await page.unroute('**/api/users**');
      
      // Hacer click en reintentar
      await page.click('[data-testid="retry-button"]');
      
      // Verificar que la página carga correctamente
      await expect(page.locator('[data-testid="users-table"]')).toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test('debe cargar en tiempo razonable', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/users');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // La página debe cargar en menos de 3 segundos
      expect(loadTime).toBeLessThan(3000);
    });

    test('debe manejar grandes cantidades de datos', async ({ page }) => {
      // Navegar a una página con muchos usuarios (si existe)
      await page.goto('/users?page=1&limit=100');
      
      // Verificar que la página responde
      await expect(page.locator('[data-testid="users-table"]')).toBeVisible();
      
      // Verificar que la búsqueda sigue siendo responsive
      await page.fill('[data-testid="search-input"]', 'test');
      await page.waitForTimeout(1000);
      
      // La página debe seguir respondiendo
      await expect(page.locator('[data-testid="search-input"]')).toHaveValue('test');
    });
  });
});
