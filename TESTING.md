# 🧪 DOCUMENTACIÓN DE PRUEBAS - MÓDULO CRUD USUARIOS

## 📋 ACTIVIDAD ACADÉMICA
**Competencia:** 05 REALIZAR PRUEBAS AL SOFTWARE PARA VERIFICAR SU FUNCIONALIDAD  
**Objetivo:** Desarrollar la automatización de pruebas para el módulo CRUD que elijas, implementando pruebas unitarias, pruebas de integración y pruebas end-to-end (E2E)

## 🎯 MÓDULO SELECCIONADO: CRUD DE USUARIOS

### ¿Por qué se seleccionó el módulo de Usuarios?
1. **Funcionalidad Completa**: Implementa todas las operaciones CRUD (Create, Read, Update, Delete)
2. **Complejidad Adecuada**: Incluye validaciones, autenticación y manejo de estados
3. **Impacto Crítico**: Los usuarios son fundamentales para el funcionamiento del sistema
4. **Diversidad de Casos**: Permite probar diferentes escenarios y flujos de trabajo

## 🏗️ ESTRUCTURA DE PRUEBAS

```
src/tests/
├── __mocks__/
│   └── userService.ts          # Mock del servicio de usuarios
├── unit/
│   ├── userService.test.ts     # Pruebas unitarias del servicio
│   └── useUsers.test.ts        # Pruebas unitarias del hook
└── integration/
    └── usersCRUD.integration.test.tsx  # Pruebas de integración
e2e/
└── usersCRUD.e2e.spec.ts       # Pruebas end-to-end
```

## 🔧 TIPOS DE PRUEBAS IMPLEMENTADAS

### 1. PRUEBAS UNITARIAS

#### 📊 userService.test.ts
- **Propósito**: Validar funciones individuales del servicio de usuarios
- **Casos de Prueba**:
  - ✅ fetchUsers - Obtener lista paginada
  - ✅ createUser - Crear nuevo usuario  
  - ✅ updateUser - Actualizar usuario existente
  - ✅ deleteUser - Eliminar usuario
  - ✅ fetchAllUsers - Obtener todos los usuarios
- **Tecnologías**: Vitest, mocks de fetch

#### 🪝 useUsers.test.ts  
- **Propósito**: Validar el comportamiento del hook personalizado
- **Casos de Prueba**:
  - ✅ Carga inicial de datos
  - ✅ Estados de loading y error
  - ✅ Paginación (setPage, setLimit)
  - ✅ Actualización automática de datos
- **Tecnologías**: Vitest, React Testing Library, React Query Testing

### 2. PRUEBAS DE INTEGRACIÓN

#### 🔗 usersCRUD.integration.test.tsx
- **Propósito**: Validar la interacción entre componentes, hooks y servicios
- **Casos de Prueba**:
  - ✅ Visualización completa de la lista de usuarios
  - ✅ Flujo completo de creación de usuarios
  - ✅ Flujo completo de edición de usuarios
  - ✅ Flujo completo de eliminación de usuarios
  - ✅ Funcionalidad de búsqueda en tiempo real
  - ✅ Manejo de estados de carga y error
  - ✅ Responsividad en diferentes pantallas
- **Tecnologías**: Vitest, React Testing Library, TanStack Router, React Query

### 3. PRUEBAS END-TO-END (E2E)

#### 🌐 usersCRUD.e2e.spec.ts
- **Propósito**: Validar el flujo completo desde la perspectiva del usuario final
- **Casos de Prueba**:
  - ✅ Autenticación y navegación
  - ✅ Visualización responsive de la interfaz
  - ✅ Creación completa de usuarios con validaciones
  - ✅ Edición de usuarios con confirmación
  - ✅ Eliminación con diálogos de confirmación
  - ✅ Búsqueda y filtrado en tiempo real
  - ✅ Flujo CRUD completo (Create → Read → Update → Delete)
  - ✅ Manejo de errores y notificaciones
  - ✅ Seguridad y validación de sesiones
  - ✅ Rendimiento y tiempos de carga
- **Tecnologías**: Playwright, navegadores reales

## 🚀 EJECUCIÓN DE PRUEBAS

### Comandos Individuales

```bash
# Pruebas unitarias con cobertura
npm run test:unit:coverage

# Pruebas de integración con cobertura  
npm run test:integration:coverage

# Pruebas E2E
npm run test:e2e

# Ver reporte de Playwright
npm run test:e2e:report
```

### Ejecución Completa

```bash
# Ejecutar todas las pruebas
npm run test:all

# Script automatizado (PowerShell)
./run-tests.ps1
```

## 📊 COBERTURA DE CÓDIGO

### Archivos Cubiertos
- ✅ `src/services/userService.ts` - 100% funciones críticas
- ✅ `src/hooks/useUsers.ts` - 100% lógica del hook
- ✅ `src/pages/Users.tsx` - Componente principal (integración)

### Métricas Objetivo
- **Statements**: ≥ 80%
- **Branches**: ≥ 75% 
- **Functions**: ≥ 90%
- **Lines**: ≥ 80%

## 🛠️ CONFIGURACIÓN TÉCNICA

### Herramientas Utilizadas

| Herramienta | Versión | Propósito |
|-------------|---------|-----------|
| **Vitest** | ^2.1.8 | Framework de testing unitario/integración |
| **Playwright** | ^1.48.2 | Testing E2E en navegadores reales |
| **React Testing Library** | ^16.1.0 | Utilities para testing de React |
| **@testing-library/user-event** | ^14.5.2 | Simulación de eventos de usuario |
| **@testing-library/jest-dom** | ^6.6.3 | Matchers adicionales para DOM |

### Configuración de Vitest

```typescript
// vitest.setup.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Configuración global de mocks
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
  writable: true,
});
```

### Configuración de Playwright

```typescript
// playwright.config.ts  
export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: 2,
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

## 📈 CASOS DE PRUEBA DETALLADOS

### Creación de Usuarios (CREATE)

| Escenario | Tipo | Estado | Descripción |
|-----------|------|--------|-------------|
| Usuario válido | Unit/Integration/E2E | ✅ | Crear usuario con datos válidos |
| Email duplicado | Unit/Integration/E2E | ✅ | Manejar error de email existente |
| Campos requeridos | Integration/E2E | ✅ | Validar campos obligatorios |
| Validación de formato | Unit/Integration | ✅ | Validar formato de email y DNI |

### Lectura de Usuarios (READ)

| Escenario | Tipo | Estado | Descripción |
|-----------|------|--------|-------------|
| Lista paginada | Unit/Integration/E2E | ✅ | Obtener usuarios con paginación |
| Búsqueda en tiempo real | Integration/E2E | ✅ | Filtrar por nombre/email |
| Estados de carga | Unit/Integration | ✅ | Mostrar loaders apropiados |
| Manejo de errores | Unit/Integration/E2E | ✅ | Mostrar mensajes de error |

### Actualización de Usuarios (UPDATE)

| Escenario | Tipo | Estado | Descripción |
|-----------|------|--------|-------------|
| Actualización exitosa | Unit/Integration/E2E | ✅ | Modificar datos existentes |
| Validación de cambios | Integration/E2E | ✅ | Validar datos modificados |
| Cancelar edición | Integration/E2E | ✅ | Descartar cambios sin guardar |
| Conflictos de datos | Unit/Integration | ✅ | Manejar errores de actualización |

### Eliminación de Usuarios (DELETE)

| Escenario | Tipo | Estado | Descripción |
|-----------|------|--------|-------------|
| Eliminación confirmada | Unit/Integration/E2E | ✅ | Eliminar con confirmación |
| Cancelar eliminación | Integration/E2E | ✅ | Rechazar confirmación |
| Eliminación en cascada | Unit | ✅ | Verificar integridad referencial |
| Permisos de eliminación | E2E | ✅ | Validar autorización |

## 🔍 ESTRATEGIAS DE TESTING

### Testing Unitario
- **Aislamiento**: Cada función se prueba independientemente
- **Mocking**: Se mockean dependencias externas (API, localStorage)
- **Cobertura**: Se prueban casos exitosos y de error
- **Rápido**: Ejecución instantánea sin dependencias externas

### Testing de Integración  
- **Componentes Conectados**: Se prueban interacciones reales
- **Estado Global**: Se valida el manejo de estado con Zustand/React Query
- **Routing**: Se prueba navegación con TanStack Router
- **UI Completa**: Se valida renderizado y comportamiento conjunto

### Testing E2E
- **Flujos Reales**: Se simula comportamiento de usuario real
- **Navegadores Múltiples**: Chrome, Firefox, Safari
- **Datos Persistentes**: Se prueba con base de datos real
- **Rendimiento**: Se validan tiempos de respuesta

## 🐛 DEBUGGING Y TROUBLESHOOTING

### Problemas Comunes

#### 1. **Errores de ESLint con naming-convention**
```bash
# Solución: Configurar reglas específicas o usar comentarios
// eslint-disable-next-line @typescript-eslint/naming-convention
id_rol: 1
```

#### 2. **Timeout en pruebas E2E**
```bash
# Solución: Aumentar timeout en playwright.config.ts
timeout: 60000
```

#### 3. **Mocks no funcionan**
```bash
# Solución: Verificar orden de imports y configuración de vi.mock()
vi.mock('../../services/userService', () => ({...}))
```

### Comandos de Debug

```bash
# Ejecutar pruebas en modo debug
npm run test:unit -- --reporter=verbose

# Ejecutar E2E en modo headed (con interfaz)
npx playwright test --headed

# Generar reporte detallado
npm run test:e2e:report
```

## 📋 CHECKLIST DE ENTREGA

### ✅ Pruebas Implementadas
- [x] Pruebas unitarias del servicio de usuarios
- [x] Pruebas unitarias del hook useUsers  
- [x] Pruebas de integración del componente Users
- [x] Pruebas E2E del flujo completo CRUD
- [x] Configuración de mocks y helpers
- [x] Cobertura de código configurada

### ✅ Documentación Completa
- [x] README de pruebas detallado
- [x] Comentarios en código de pruebas
- [x] Casos de prueba documentados
- [x] Comandos de ejecución explicados
- [x] Troubleshooting incluido

### ✅ Automatización
- [x] Scripts de npm configurados
- [x] Script PowerShell para ejecución completa
- [x] CI/CD ready (puede integrarse con GitHub Actions)
- [x] Reportes automáticos generados

## 🎓 CONCLUSIONES ACADÉMICAS

### Aprendizajes Clave
1. **Testing Pyramid**: Implementación correcta de los tres niveles de testing
2. **Herramientas Modernas**: Uso de Vitest y Playwright para testing actual
3. **Cobertura Efectiva**: Balance entre cobertura y mantenibilidad
4. **Automatización**: Scripts que facilitan ejecución y mantenimiento

### Beneficios del Proyecto
- **Calidad**: Detección temprana de bugs y regresiones
- **Confianza**: Seguridad para realizar cambios y refactoring
- **Documentación**: Las pruebas sirven como documentación viva
- **Mantenimiento**: Facilita el mantenimiento a largo plazo

### Aplicación Profesional
- Metodología aplicable a proyectos reales
- Herramientas utilizadas en la industria
- Buenas prácticas de testing implementadas
- Base sólida para desarrollo de software de calidad

---

**📧 Contacto**: Para dudas o sugerencias sobre la implementación de pruebas.  
**📅 Fecha**: Diciembre 2024  
**🏫 Institución**: SENA - Séptimo Trimestre  
**👨‍💻 Desarrollador**: Diego - Acuaterra Project
