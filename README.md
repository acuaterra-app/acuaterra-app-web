# 🌊 Acuaterra App Web

> **Sistema de Gestión de Acuicultura** - Plataforma web moderna para el manejo integral de granjas acuícolas, módulos de cultivo y reportes de producción.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg)
![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0+-06B6D4.svg)

## 📋 Descripción

**Acuaterra App Web** es una aplicación web moderna y responsiva diseñada para la gestión integral de operaciones acuícolas. Permite a los usuarios administrar granjas, módulos de cultivo, usuarios y generar reportes detallados de producción.

### 🎯 Características Principales

- **🏠 Gestión de Granjas**: Administración completa de granjas acuícolas
- **🐟 Módulos de Cultivo**: Control detallado de módulos de producción
- **👥 Gestión de Usuarios**: Sistema de usuarios con roles y permisos
- **📊 Dashboard Analítico**: Visualización de datos con gráficos interactivos
- **📈 Reportes**: Generación de reportes detallados de producción
- **🔍 Búsqueda Global**: Búsqueda avanzada sobre todos los elementos
- **🌙 Dark Mode**: Modo oscuro completo
- **📱 Responsive Design**: Diseño adaptable para todos los dispositivos
- **🔐 Autenticación**: Sistema seguro de autenticación JWT
- **🌐 Internacionalización**: Soporte multiidioma (ES/EN)

## 🚀 Tecnologías Utilizadas

### **Frontend Core**
- **React 18.3.1** - Biblioteca de UI
- **TypeScript 5.0+** - Tipado estático
- **Vite 5.0+** - Build tool y servidor de desarrollo
- **TailwindCSS 3.0+** - Framework de CSS utilitario

### **Estado y Navegación**
- **Zustand 4.5+** - Gestión de estado global
- **TanStack Router 1.51+** - Enrutamiento type-safe
- **TanStack Query 5.53+** - Gestión de estado del servidor

### **UI y Animaciones**
- **Framer Motion 12.5+** - Animaciones fluidas
- **Material-UI 6.4+** - Componentes de interfaz
- **React Icons 5.5+** - Iconografía
- **Styled Components 6.1+** - CSS-in-JS

### **Visualización de Datos**
- **Chart.js 4.4+** + **React-ChartJS-2** - Gráficos
- **Nivo Charts 0.87+** - Visualizaciones avanzadas
- **TanStack Table 8.20+** - Tablas interactivas

### **Formularios y Validación**
- **React Hook Form 7.53+** - Gestión de formularios
- **Zod 3.23+** - Validación de esquemas
- **React DatePicker 8.3+** - Selectores de fecha

### **Calidad de Código**
- **ESLint** - Linting de código
- **Prettier** - Formateo de código
- **Commitlint** - Convenciones de commits
- **Husky** - Git hooks
- **Vitest** - Testing unitario
- **Playwright** - Testing E2E

## 📁 Estructura del Proyecto

```
src/
├── 📂 assets/          # Recursos estáticos (imágenes, iconos)
├── 📂 common/          # Utilitarios y tipos compartidos
├── 📂 components/      # Componentes reutilizables
│   ├── 📂 charts/      # Componentes de gráficos
│   ├── 📂 DashBoard/   # Componentes del dashboard
│   ├── 📂 forms/       # Componentes de formularios
│   ├── 📂 layout/      # Componentes de layout
│   ├── 📂 loaders/     # Componentes de loading
│   ├── 📂 Slider/      # Componentes de slider
│   ├── 📂 Spinner/     # Componentes de spinner
│   └── 📂 ui/          # Componentes de interfaz base
├── 📂 hooks/           # Custom React hooks
├── 📂 pages/           # Páginas principales
├── 📂 routes/          # Configuración de rutas
├── 📂 services/        # Servicios de API
├── 📂 store/           # Estados globales (Zustand)
└── 📂 styles/          # Estilos globales
```

## 🛠️ Instalación y Configuración

### **Prerrequisitos**
- Node.js 18+ 
- npm o pnpm
- Git

### **1. Clonar el Repositorio**
```bash
git clone [https://github.com/acuaterra-app/acuaterra-app-web.git]
cd acuaterra-app-web
```

### **2. Instalar Dependencias**
```bash
# Con npm
npm install

# Con pnpm (recomendado)
pnpm install
```

### **3. Configurar Variables de Entorno**
```bash
# Crear archivo .env
cp .env.example .env

# Configurar variables necesarias
VITE_API_BASE_URL=your_api_url
VITE_APP_NAME=Acuaterra
```

### **4. Ejecutar en Desarrollo**
```bash
npm run dev
# o
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run build           # Build de producción
npm run preview         # Preview del build

# Calidad de Código
npm run lint            # Ejecutar ESLint
npm run lint:fix        # Corregir errores de lint automáticamente
npm run format          # Formatear código con Prettier

# Testing
npm run test            # Ejecutar todos los tests
npm run test:unit       # Tests unitarios
npm run test:e2e        # Tests end-to-end
npm run test:unit:coverage  # Coverage de tests unitarios

# Storybook
npm run storybook       # Ejecutar Storybook
npm run storybook:build # Build de Storybook

# Configuración
npm run setup           # Configuración inicial del proyecto
```

## 🎨 Características de UI/UX

### **Diseño Moderno**
- **Glassmorphism**: Efectos de vidrio y transparencias
- **Animaciones Fluidas**: Transiciones suaves con Framer Motion
- **Responsive First**: Diseño móvil prioritario
- **Dark Mode**: Tema oscuro completo y persistente

### **Componentes Destacados**
- **Sidebar Dinámico**: Navegación colapsible con animaciones
- **Tablas Interactivas**: Búsqueda global, paginación y filtros
- **Dashboard Analítico**: Gráficos en tiempo real
- **Formularios Inteligentes**: Validación en tiempo real
- **Selectores Avanzados**: Búsqueda con carga de todos los elementos

### **Experiencia de Usuario**
- **Loading States**: Estados de carga descriptivos
- **Error Handling**: Manejo elegante de errores
- **Feedback Visual**: Confirmaciones y notificaciones
- **Navegación Intuitiva**: Rutas type-safe y breadcrumbs

## 🔧 Funcionalidades Técnicas Destacadas

### **Búsqueda Global**
- Implementación de búsqueda sobre todos los elementos (no limitada a paginación)
- Filtrado reactivo en múltiples campos
- Paginación local inteligente

### **Gestión de Estado**
- Estado global con Zustand
- Cache inteligente con TanStack Query
- Persistencia de preferencias de usuario

### **Performance**
- Lazy loading de componentes
- Memoización inteligente
- Optimización de re-renders
- Code splitting automático

### **Seguridad**
- Autenticación JWT
- Validación de rutas protegidas
- Sanitización de datos
- Manejo seguro de tokens

## 📊 Arquitectura de Datos

### **Entidades Principales**
- **Farm**: Granjas acuícolas
- **Module**: Módulos de cultivo
- **User**: Usuarios del sistema
- **Report**: Reportes de producción

### **Flujo de Datos**
1. **API Services**: Comunicación con backend
2. **Custom Hooks**: Lógica de negocio encapsulada
3. **Global Store**: Estado compartido (Zustand)
4. **Local State**: Estado de componentes
5. **Cache Layer**: TanStack Query para optimización

## �️ Metodología de Estructura de Código

### **Filosofía: Lógica → Presentación → Estilos**

Acuaterra implementa una metodología consistente para la organización de código en páginas y componentes, siguiendo el principio de **cohesión y separación clara de responsabilidades**.

### **📄 Estructura de Páginas**

Cada página del proyecto sigue esta estructura estándar:

```tsx
// 1. IMPORTS Y DEPENDENCIAS
import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import styled from "styled-components";
import CustomHook from "../hooks/useCustomHook";

// 2. STYLED COMPONENTS (Estilos encapsulados)
const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${props => props.darkMode ? '#111827' : '#fff'};
`;

const ContentContainer = styled.main`
  flex: 1;
  padding: 2rem;
  transition: all 0.3s ease;
`;

// 3. LÓGICA DEL COMPONENTE
const MyPage: FunctionComponent = () => {
  // Estados locales
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Hooks personalizados
  const { data, error } = useCustomHook();
  const navigate = useNavigate();
  
  // Effects y funciones de negocio
  useEffect(() => {
    // Lógica de inicialización
    loadData();
  }, []);
  
  const handleAction = async () => {
    // Lógica de acciones
  };
  
  // 4. RENDER (PRESENTACIÓN)
  return (
    <PageWrapper darkMode={darkMode}>
      <ContentContainer>
        <h1>Mi Página</h1>
        {/* JSX estructurado */}
      </ContentContainer>
    </PageWrapper>
  );
};

export default MyPage;
```

### **🧩 Estructura de Componentes**

Los componentes siguen la misma metodología con énfasis en la **encapsulación**:

```tsx
// 1. IMPORTS
import React from 'react';
import styled from 'styled-components';

// 2. STYLED COMPONENTS
const ButtonWrapper = styled.button`
  background: ${props => props.variant === 'primary' ? '#3CACAC' : '#gray'};
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    opacity: 0.9;
  }
`;

// 3. LÓGICA
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}

const CustomButton: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  onClick, 
  children 
}) => {
  const handleClick = () => {
    // Lógica antes del click
    onClick();
  };
  
  // 4. RENDER
  return (
    <ButtonWrapper variant={variant} onClick={handleClick}>
      {children}
    </ButtonWrapper>
  );
};

export default CustomButton;
```

### **✅ Ventajas de esta Metodología**

#### **🎯 Cohesión Alta**
- Todo lo relacionado con un componente/página está en un lugar
- Fácil mantenimiento y debugging
- Modificaciones rápidas sin buscar en múltiples archivos

#### **🔍 Legibilidad**
- Estructura predecible en todos los archivos
- Separación clara entre lógica y presentación
- Estilos encapsulados y reutilizables

#### **🛠️ Mantenibilidad**
- Cambios aislados a un solo archivo
- Menos conflictos en trabajo en equipo
- Testing más directo y enfocado

#### **🎨 Styled Components Benefits**
- **Props Dinámicas**: Estilos que responden a estado (`darkMode`, `isActive`)
- **Encapsulación**: No hay conflictos de CSS globales
- **IntelliSense**: Autocompletado de props y estilos
- **Performance**: CSS crítico inline, resto lazy-loaded

### **📁 Ejemplos Reales en Acuaterra**

#### **Página Farm.tsx**
```tsx
// ✅ Estructura real implementada:
// 1. Imports (líneas 1-25)
// 2. Styled Components (líneas 30-85)  
// 3. Lógica del componente (líneas 90-350)
// 4. Return con JSX (líneas 370-556)
```

#### **Componente TableWithActions**
```tsx
// ✅ Sigue la misma metodología:
// - Imports y types
// - Styled components para tabla responsive
// - Lógica de paginación, búsqueda y acciones
// - Render final con tabla estructurada
```

### **🔧 Integración con Herramientas**

#### **Con Styled Components**
- Temas dinámicos (`theme.colors.primary`)
- Props reactivas (`${props => props.active}`)
- Media queries encapsuladas
- Animaciones CSS-in-JS

#### **Con TypeScript**
- Props tipadas en styled components
- Interfaces claras para componentes
- Autocompletado en estilos dinámicos

#### **Con ESLint/Prettier**
- Formato consistente automático
- Reglas específicas para styled-components
- Organización automática de imports

### **📝 Guías para Sustentación**

**Pregunta**: *"¿Por qué no separaron estilos en archivos CSS?"*

**Respuesta**: *"Usamos CSS-in-JS con styled-components porque nos permite tener estilos encapsulados, dinámicos y cerca de la lógica que los utiliza. Esto elimina problemas de CSS globales, permite estilos reactivos basados en props (como darkMode), y mejora la mantenibilidad al tener todo en un solo archivo."*

**Pregunta**: *"¿Cómo manejan la reutilización de estilos?"*

**Respuesta**: *"Tenemos un sistema de design tokens y componentes base reutilizables. Los styled-components pueden extenderse y recibir props para variaciones. Además, usamos temas globales para colores y espaciados consistentes."*

## �🌐 Internacionalización

La aplicación soporta múltiples idiomas mediante `i18next`:

- **Español (ES)**: Idioma principal
- **Inglés (EN)**: Idioma secundario
- **Detección Automática**: Basada en configuración del navegador
- **Persistencia**: Preferencia guardada localmente

## 📱 Responsividad

### **Breakpoints Principales**
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### **Adaptaciones por Dispositivo**
- **Móvil**: Sidebar colapsible, tablas adaptadas, navegación táctil
- **Tablet**: Layout híbrido, componentes optimizados
- **Desktop**: Experiencia completa, múltiples paneles

## 🚦 Estados de la Aplicación

### **Estados de Carga**
- **Skeleton Loaders**: Para contenido principal
- **Spinners**: Para acciones rápidas
- **Progress Bars**: Para procesos largos

### **Estados de Error**
- **Error Boundaries**: Captura de errores globales
- **Fallback UI**: Interfaces de recuperación
- **Toast Notifications**: Errores no críticos

### **Estados Vacíos**
- **Empty States**: Interfaces cuando no hay datos
- **Call to Actions**: Guías para primeros pasos
- **Ilustraciones**: Feedback visual amigable

## 🔐 Seguridad y Autenticación

### **Flujo de Autenticación**
1. Login con credenciales
2. Recepción de JWT token
3. Almacenamiento seguro del token
4. Validación automática en cada request
5. Refresh automático antes del vencimiento

### **Rutas Protegidas**
- Validación de token en cada navegación
- Redirección automática al login si no está autenticado
- Manejo de roles y permisos

## 🎯 Roadmap y Mejoras Futuras

### **v1.1.0**
- [ ] Sistema de notificaciones en tiempo real
- [ ] Exportación avanzada de reportes (PDF, Excel)
- [ ] Dashboard personalizable

### **v1.2.0**
- [ ] Modo offline con sincronización
- [ ] PWA (Progressive Web App)
- [ ] Geolocalización de granjas

### **v2.0.0**
- [ ] Módulo de predicción con IA
- [ ] Integración con IoT sensors
- [ ] API GraphQL

## 👥 Contribución

### **Guías de Contribución**
1. Fork del repositorio
2. Crear branch para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commits siguiendo convenciones (`feat:`, `fix:`, `docs:`, etc.)
4. Tests para nueva funcionalidad
5. Pull request con descripción detallada

### **Convenciones de Código**
- **TypeScript**: Tipado estricto
- **ESLint**: Configuración estricta
- **Prettier**: Formateo automático
- **Commits**: Conventional commits

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto y Soporte

- **Proyecto**: Acuaterra App Web
- **Institución**: SENA - 7mo Trimestre
- **Tecnologías**: React + TypeScript + Vite

### 👨‍💻 **Equipo de Desarrollo**
- **Diego Alonso Ruiz** - Frontend Developer
- **Duber Alberto Imbachi** - Frontend Developer  
- **William David Perdigón** - Frontend Developer

---

<div align="center">

**🌊 Construido con ❤️ para la industria acuícola**

*Potenciando la gestión sostenible de recursos acuáticos*

</div>
