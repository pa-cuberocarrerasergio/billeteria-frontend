# BilleterIA — Frontend (SPA)

> Interfaz de usuario del proyecto BilleterIA. Construida con **React 19** + **Vite 8** + **React Router 7**.

---

## Requisitos Previos

- Node.js 20+
- npm 10+
- El backend de BilleterIA corriendo en `http://localhost:8000`

---

## Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Crear el fichero de entorno
# Crea un archivo .env en la raíz del frontend con:
VITE_API_URL=http://localhost:8000/api
VITE_GOOGLE_CLIENT_ID=tu_google_client_id

# 3. Arrancar el servidor de desarrollo
npm run dev
```

> App disponible en `http://localhost:5173`

---

## Scripts Disponibles

```bash
npm run dev       # Servidor de desarrollo con hot reload
npm run build     # Build de producción
npm run preview   # Preview del build de producción
npm run lint      # Linting con oxlint
```

---

## Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL base de la API del backend | `http://localhost:8000/api` |
| `VITE_GOOGLE_CLIENT_ID` | Client ID de Google OAuth | `3334...apps.googleusercontent.com` |

---

## Estructura de Páginas

| Ruta | Componente | Auth | Descripción |
|------|------------|------|-------------|
| `/` | `LandingPage` | ❌ | Landing con demo interactivo |
| `/login` | `Login` | ❌ | Login / Registro |
| `/dashboard` | `Dashboard` | ✅ | Panel financiero principal |
| `/transactions` | `Transactions` | ✅ | Listado de transacciones |
| `/transactions/create` | `CreateTransaction` | ✅ | Crear transacción |
| `/transactions/:id/edit` | `EditTransaction` | ✅ | Editar transacción |
| `/saving-goals` | `SavingGoals` | ✅ | Objetivos de ahorro |
| `/saving-goals/create` | `CreateSavingGoal` | ✅ | Crear objetivo |
| `/saving-goals/:id/edit` | `EditSavingGoal` | ✅ | Editar objetivo |
| `/coach` | `Coach` | ✅ | Chat con Billetín (IA) |
| `/achievements` | `Achievements` | ✅ | Logros desbloqueados |
| `/profile` | `Profile` | ✅ | Perfil y preferencias |
| `/demo/dashboard` | `DemoDashboard` | ❌ | Demo sin registro |
| `/demo/coach` | `DemoCoach` | ❌ | Demo del coach IA |
| `/demo/transactions` | `DemoTransactions` | ❌ | Demo transacciones |
| `/demo/achievements` | `DemoAchievements` | ❌ | Demo logros |

---

## Dependencias Principales

| Paquete | Versión | Uso |
|---------|---------|-----|
| `react` | 19 | Framework de UI |
| `react-dom` | 19 | Renderizado DOM |
| `react-router-dom` | 7 | Enrutamiento SPA |
| `axios` | 1.x | Cliente HTTP |
| `recharts` | 3 | Gráficos financieros |
| `lucide-react` | 1.x | Iconos |
| `@react-oauth/google` | 0.13 | Login con Google |
