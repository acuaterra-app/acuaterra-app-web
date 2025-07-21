import { test, expect, Page } from '@playwright/test';

// Configuración de datos de prueba
const TEST_USER = {
  name: 'Usuario E2E Test',
  email: 'e2e.test@ejemplo.com',
  dni: '12345678',
  contact: '123456789',
  address: 'Dirección de prueba E2E'
};

const UPDATED_USER = {
  name: 'Usuario E2E Actualizado',
  email: 'e2e.actualizado@ejemplo.com',
  dni: '87654321',
  contact: '987654321',
  address: 'Dirección actualizada E2E'
};

// Funciones auxiliares
async function loginUser(page: Page) {
  await page.goto('/auth');
  
  // Esperar a que aparezca el formulario de login
  await page.waitForSelector('input[type="email"]');
  
  // Llenar credenciales
  await page.fill('input[type="email"]', 'admin@test.com');
  await page.fill('input[type="password"]', 'password123');
  
  // Hacer clic en el botón de login
  await page.click('button[type="submit"]');
  
  // Esperar redirección al dashboard
  await page.waitForURL('/home');
}

async function navigateToUsers(page: Page) {
  // Navegar a la página de usuarios
  await page.goto('/users');
  
  // Esperar a que cargue la página
  await page.waitForSelector('text=Lista de Usuarios');
}

async function fillUserForm(page: Page, userData: typeof TEST_USER) {
  await page.fill('input[name="name"]', userData.name);
  await page.fill('input[name="email"]', userData.email);
  await page.fill('input[name="dni"]', userData.dni);
  await page.fill('input[name="contact"]', userData.contact);
  await page.fill('input[name="address"]', userData.address);
  
  // Seleccionar rol si existe el selector
  const roleSelect = page.locator('select[name="id_rol"]');
  if (await roleSelect.count() > 0) {
    await roleSelect.selectOption('2'); // Rol USER
  }
}

test.describe('🧪 PRUEBAS E2E - Sistema CRUD de Usuarios', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login antes de cada prueba
    await loginUser(page);
  });

  test.describe('📋 Visualización de Usuarios', () => {
    
    test('✅ Debe mostrar la página de usuarios correctamente', async ({ page }) => {
      await navigateToUsers(page);
      
      // Verificar elementos principales de la UI
      await expect(page.locator('text=Lista de Usuarios')).toBeVisible();
      await expect(page.locator('text=Agregar Usuario')).toBeVisible();
      await expect(page.locator('input[placeholder*="Buscar usuarios"]')).toBeVisible();
      
      // Verificar que hay una tabla o lista de usuarios
      const userTable = page.locator('table').or(page.locator('[data-testid*="user"]'));
      await expect(userTable).toBeVisible();
    });

    test('🔍 Debe funcionar la búsqueda de usuarios', async ({ page }) => {
      await navigateToUsers(page);
      
      // Buscar por un término específico
      const searchInput = page.locator('input[placeholder*="Buscar usuarios"]');
      await searchInput.fill('admin');
      
      // Esperar a que se filtre la lista
      await page.waitForTimeout(1000);
      
      // Verificar que la búsqueda funciona
      const searchResults = page.locator('[data-testid*="user"]').or(page.locator('tbody tr'));
      const resultsCount = await searchResults.count();
      
      // Si hay resultados, verificar que contienen el término buscado
      if (resultsCount > 0) {
        const firstResult = searchResults.first();
        const resultText = await firstResult.textContent();
        expect(resultText?.toLowerCase()).toContain('admin');
      }
      
      // Limpiar búsqueda
      await searchInput.clear();
      await page.waitForTimeout(500);
    });

    test('📱 Debe ser responsive en diferentes tamaños de pantalla', async ({ page }) => {
      await navigateToUsers(page);
      
      // Probar en móvil
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(page.locator('text=Lista de Usuarios')).toBeVisible();
      
      // Probar en tablet
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(page.locator('text=Lista de Usuarios')).toBeVisible();
      
      // Volver a desktop
      await page.setViewportSize({ width: 1920, height: 1080 });
      await expect(page.locator('text=Lista de Usuarios')).toBeVisible();
    });
  });

  test.describe('➕ Creación de Usuarios', () => {
    
    test('✅ Debe crear un nuevo usuario exitosamente', async ({ page }) => {
      await navigateToUsers(page);
      
      // Abrir modal de registro
      await page.click('text=Agregar Usuario');
      
      // Esperar a que aparezca el modal
      await page.waitForSelector('[data-testid="register-user-modal"]', { timeout: 5000 });
      
      // Llenar el formulario
      await fillUserForm(page, TEST_USER);
      
      // Enviar formulario
      await page.click('button[type="submit"]');
      
      // Esperar notificación de éxito
      await expect(page.locator('text=Usuario registrado exitosamente')).toBeVisible({ timeout: 10000 });
      
      // Verificar que el modal se cierra
      await expect(page.locator('[data-testid="register-user-modal"]')).not.toBeVisible();
      
      // Verificar que el usuario aparece en la lista
      await page.waitForTimeout(2000);
      await expect(page.locator(`text=${TEST_USER.name}`)).toBeVisible();
    });

    test('❌ Debe mostrar error al crear usuario con email duplicado', async ({ page }) => {
      await navigateToUsers(page);
      
      // Crear primer usuario
      await page.click('text=Agregar Usuario');
      await page.waitForSelector('[data-testid="register-user-modal"]');
      await fillUserForm(page, TEST_USER);
      await page.click('button[type="submit"]');
      await page.waitForTimeout(3000);
      
      // Intentar crear segundo usuario con mismo email
      await page.click('text=Agregar Usuario');
      await page.waitForSelector('[data-testid="register-user-modal"]');
      await fillUserForm(page, { ...TEST_USER, name: 'Usuario Duplicado' });
      await page.click('button[type="submit"]');
      
      // Esperar mensaje de error
      await expect(page.locator('text=Email ya existe').or(
        page.locator('text=ya está en uso')
      )).toBeVisible({ timeout: 10000 });
    });

    test('🔧 Debe validar campos obligatorios', async ({ page }) => {
      await navigateToUsers(page);
      
      // Abrir modal
      await page.click('text=Agregar Usuario');
      await page.waitForSelector('[data-testid="register-user-modal"]');
      
      // Intentar enviar formulario vacío
      await page.click('button[type="submit"]');
      
      // Verificar mensajes de validación HTML5 o campos requeridos
      const nameInput = page.locator('input[name="name"]');
      const emailInput = page.locator('input[name="email"]');
      
      await expect(nameInput).toBeVisible();
      await expect(emailInput).toBeVisible();
      
      // Verificar que el modal sigue abierto
      await expect(page.locator('[data-testid="register-user-modal"]')).toBeVisible();
    });
  });

  test.describe('✏️ Edición de Usuarios', () => {
    
    test('✅ Debe editar un usuario exitosamente', async ({ page }) => {
      await navigateToUsers(page);
      
      // Buscar y hacer clic en el primer botón de editar
      const editButton = page.locator('button:has-text("Editar")').first();
      await editButton.click();
      
      // Esperar modal de edición
      await page.waitForSelector('[data-testid="update-user-modal"]', { timeout: 5000 });
      
      // Modificar el nombre
      const nameInput = page.locator('input[name="name"]');
      await nameInput.clear();
      await nameInput.fill(UPDATED_USER.name);
      
      // Guardar cambios
      await page.click('button:has-text("Actualizar")');
      
      // Esperar confirmación
      await expect(page.locator('text=Usuario actualizado exitosamente')).toBeVisible({ timeout: 10000 });
      
      // Verificar que se actualizó en la lista
      await page.waitForTimeout(2000);
      await expect(page.locator(`text=${UPDATED_USER.name}`)).toBeVisible();
    });

    test('❌ Debe cancelar la edición sin guardar cambios', async ({ page }) => {
      await navigateToUsers(page);
      
      // Obtener nombre original del primer usuario
      const originalName = await page.locator('tbody tr').first().locator('td').first().textContent();
      
      // Abrir modal de edición
      const editButton = page.locator('button:has-text("Editar")').first();
      await editButton.click();
      
      await page.waitForSelector('[data-testid="update-user-modal"]');
      
      // Modificar el nombre
      const nameInput = page.locator('input[name="name"]');
      await nameInput.clear();
      await nameInput.fill('Nombre Temporal');
      
      // Cancelar
      await page.click('button:has-text("Cancelar")');
      
      // Verificar que el modal se cierra
      await expect(page.locator('[data-testid="update-user-modal"]')).not.toBeVisible();
      
      // Verificar que el nombre original se mantiene
      if (originalName) {
        await expect(page.locator(`text=${originalName}`)).toBeVisible();
      }
    });
  });

  test.describe('🗑️ Eliminación de Usuarios', () => {
    
    test('✅ Debe eliminar un usuario con confirmación', async ({ page }) => {
      await navigateToUsers(page);
      
      // Crear un usuario para eliminar
      await page.click('text=Agregar Usuario');
      await page.waitForSelector('[data-testid="register-user-modal"]');
      await fillUserForm(page, TEST_USER);
      await page.click('button[type="submit"]');
      await page.waitForTimeout(3000);
      
      // Buscar el usuario creado y eliminarlo
      const userRow = page.locator(`text=${TEST_USER.name}`).locator('..').locator('..');
      const deleteButton = userRow.locator('button:has-text("Eliminar")');
      
      // Mock del dialog de confirmación
      page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('¿Estás seguro');
        await dialog.accept();
      });
      
      await deleteButton.click();
      
      // Esperar confirmación de eliminación
      await expect(page.locator('text=Usuario eliminado exitosamente')).toBeVisible({ timeout: 10000 });
      
      // Verificar que el usuario ya no está en la lista
      await page.waitForTimeout(2000);
      await expect(page.locator(`text=${TEST_USER.name}`)).not.toBeVisible();
    });

    test('❌ Debe cancelar eliminación si se rechaza confirmación', async ({ page }) => {
      await navigateToUsers(page);
      
      // Obtener el primer usuario para intentar eliminar
      const firstUserName = await page.locator('tbody tr').first().locator('td').first().textContent();
      
      if (firstUserName) {
        // Mock del dialog rechazado
        page.on('dialog', async dialog => {
          await dialog.dismiss();
        });
        
        // Intentar eliminar
        const deleteButton = page.locator('button:has-text("Eliminar")').first();
        await deleteButton.click();
        
        // Verificar que el usuario sigue en la lista
        await page.waitForTimeout(1000);
        await expect(page.locator(`text=${firstUserName}`)).toBeVisible();
      }
    });
  });

  test.describe('🔄 Flujo Completo CRUD', () => {
    
    test('✅ Debe realizar operaciones CRUD completas', async ({ page }) => {
      await navigateToUsers(page);
      
      const testEmail = `crud.test.${Date.now()}@ejemplo.com`;
      const testUser = { ...TEST_USER, email: testEmail };
      const updatedUser = { ...UPDATED_USER, email: testEmail };
      
      // 1. CREAR usuario
      await page.click('text=Agregar Usuario');
      await page.waitForSelector('[data-testid="register-user-modal"]');
      await fillUserForm(page, testUser);
      await page.click('button[type="submit"]');
      await expect(page.locator('text=Usuario registrado exitosamente')).toBeVisible({ timeout: 10000 });
      
      // Verificar creación
      await page.waitForTimeout(2000);
      await expect(page.locator(`text=${testUser.name}`)).toBeVisible();
      
      // 2. LEER/BUSCAR usuario
      const searchInput = page.locator('input[placeholder*="Buscar usuarios"]');
      await searchInput.fill(testUser.name);
      await page.waitForTimeout(1000);
      await expect(page.locator(`text=${testUser.name}`)).toBeVisible();
      await searchInput.clear();
      
      // 3. ACTUALIZAR usuario
      const userRow = page.locator(`text=${testUser.name}`).locator('..').locator('..');
      const editButton = userRow.locator('button:has-text("Editar")');
      await editButton.click();
      
      await page.waitForSelector('[data-testid="update-user-modal"]');
      const nameInput = page.locator('input[name="name"]');
      await nameInput.clear();
      await nameInput.fill(updatedUser.name);
      await page.click('button:has-text("Actualizar")');
      
      await expect(page.locator('text=Usuario actualizado exitosamente')).toBeVisible({ timeout: 10000 });
      
      // Verificar actualización
      await page.waitForTimeout(2000);
      await expect(page.locator(`text=${updatedUser.name}`)).toBeVisible();
      
      // 4. ELIMINAR usuario
      const updatedRow = page.locator(`text=${updatedUser.name}`).locator('..').locator('..');
      const deleteButton = updatedRow.locator('button:has-text("Eliminar")');
      
      page.on('dialog', async dialog => {
        await dialog.accept();
      });
      
      await deleteButton.click();
      await expect(page.locator('text=Usuario eliminado exitosamente')).toBeVisible({ timeout: 10000 });
      
      // Verificar eliminación
      await page.waitForTimeout(2000);
      await expect(page.locator(`text=${updatedUser.name}`)).not.toBeVisible();
    });
  });

  test.describe('🔐 Seguridad y Autenticación', () => {
    
    test('❌ Debe redirigir a login si no hay token válido', async ({ page }) => {
      // Limpiar localStorage
      await page.evaluate(() => {
        localStorage.clear();
      });
      
      // Intentar acceder a usuarios sin autenticación
      await page.goto('/users');
      
      // Debe redirigir a login
      await expect(page).toHaveURL(/.*\/auth/);
    });

    test('✅ Debe mantener la sesión durante las operaciones', async ({ page }) => {
      await navigateToUsers(page);
      
      // Realizar varias operaciones para verificar que la sesión se mantiene
      await page.click('text=Agregar Usuario');
      await page.waitForSelector('[data-testid="register-user-modal"]');
      await page.click('button:has-text("Cancelar")');
      
      // Navegar a otra página y volver
      await page.goto('/home');
      await page.goto('/users');
      
      // Verificar que sigue autenticado
      await expect(page.locator('text=Lista de Usuarios')).toBeVisible();
    });
  });

  test.describe('⚡ Rendimiento y Carga', () => {
    
    test('✅ Debe cargar la página en tiempo razonable', async ({ page }) => {
      const startTime = Date.now();
      
      await navigateToUsers(page);
      
      const loadTime = Date.now() - startTime;
      
      // La página debe cargar en menos de 5 segundos
      expect(loadTime).toBeLessThan(5000);
      
      // Verificar que los elementos principales están cargados
      await expect(page.locator('text=Lista de Usuarios')).toBeVisible();
    });

    test('📊 Debe manejar paginación si existe', async ({ page }) => {
      await navigateToUsers(page);
      
      // Buscar controles de paginación
      const paginationControls = page.locator('[data-testid*="pagination"]')
        .or(page.locator('.pagination'))
        .or(page.locator('button:has-text("Siguiente")'));
      
      const hasPagination = await paginationControls.count() > 0;
      
      if (hasPagination) {
        // Probar navegación de páginas
        const nextButton = page.locator('button:has-text("Siguiente")').first();
        if (await nextButton.isVisible() && await nextButton.isEnabled()) {
          await nextButton.click();
          await page.waitForTimeout(1000);
          
          // Verificar que cambió el contenido
          await expect(page.locator('text=Lista de Usuarios')).toBeVisible();
        }
      }
    });
  });
});
