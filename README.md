# API de Gestión de Tareas

API REST completa construida con **Express 5**, **TypeScript strict** y **Supabase** como base de datos PostgreSQL.

## Stack tecnológico

| Tecnología | Versión | Rol |
|---|---|---|
| Express.js | 5.x | Framework web |
| TypeScript | 5.x strict | Tipado estático |
| Supabase | 2.x | PostgreSQL + Auth JWT |
| Zod | 3.x | Validación de esquemas |
| Helmet + CORS | latest | Seguridad HTTP |
| Jest + Supertest | 29.x | Testing |

## Inicio rápido

### 1. Clonar e instalar dependencias
```bash
git clone <repo>
cd api-tasks
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus credenciales de Supabase
```

### 3. Crear la tabla en Supabase
Ejecuta el contenido de `supabase-schema.sql` en el SQL Editor de tu proyecto Supabase.

### 4. Iniciar en modo desarrollo
```bash
npm run dev
```
La API estará disponible en `http://localhost:3000`.

## Endpoints

Base URL: `/api/v1`

| Método | Ruta | Descripción | Auth |
|---|---|---|---|
| POST | `/auth/register` | Registrar usuario | No |
| POST | `/auth/login` | Login, retorna JWT | No |
| GET | `/tasks` | Listar tareas del usuario | Sí |
| GET | `/tasks/:id` | Obtener tarea por ID | Sí |
| POST | `/tasks` | Crear tarea | Sí |
| PATCH | `/tasks/:id` | Actualizar tarea | Sí |
| DELETE | `/tasks/:id` | Eliminar tarea | Sí |
| GET | `/health` | Health check | No |

## Autenticación

Todas las rutas de `/tasks` requieren el header:
```
Authorization: Bearer <token>
```
El token se obtiene al hacer login.

## Scripts

```bash
npm run dev    # Desarrollo con hot-reload
npm run build  # Compilar TypeScript
npm start      # Producción (requiere build previo)
npm test       # Tests con cobertura
npm run lint   # Verificar tipos sin compilar
```

## Deploy con Docker

```bash
# Build de la imagen
docker build -t api-tasks .

# Ejecutar con variables de entorno
docker run -p 3000:3000 --env-file .env api-tasks
```
