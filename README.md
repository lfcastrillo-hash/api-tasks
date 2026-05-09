# API de Gestión de Tareas

API REST construida con **Express 5**, **TypeScript strict** y **Supabase** como base de datos PostgreSQL en la nube.

---

## Stack tecnológico

| Tecnología       | Versión    | Rol                    |
| ---------------- | ---------- | ---------------------- |
| Express.js       | 5.x        | Framework web          |
| TypeScript       | 5.x strict | Tipado estático        |
| Supabase         | 2.x        | PostgreSQL + Auth JWT  |
| Zod              | 3.x        | Validación de esquemas |
| Helmet + CORS    | latest     | Seguridad HTTP         |
| Jest + Supertest | 29.x       | Testing                |

---

## Requisitos previos

- Node.js 20 o superior
- Una cuenta gratuita en [supabase.com](https://supabase.com)

---

## Instalación paso a paso

### 1. Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/api-tasks.git
cd api-tasks
npm install
```

### 2. Crear el proyecto en Supabase

1. Ir a [supabase.com](https://supabase.com) → **New Project**
2. Asignar un nombre y contraseña
3. Esperar ~2 minutos a que el proyecto se inicialice

### 3. Crear la tabla en Supabase

1. En el dashboard → **SQL Editor** → **New query**
2. Copiar y pegar el contenido del archivo `supabase-schema.sql`
3. Clic en **Run**

### 4. Configurar las variables de entorno

```bash
cp .env.example .env
```

Editar `.env` con las credenciales del proyecto. Se encuentran en **Settings → API** del dashboard de Supabase:

```env
NODE_ENV=development
PORT=3000

SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co   # Project URL (solo el dominio, sin barra al final)
SUPABASE_ANON_KEY=eyJ...                         # anon / public key
SUPABASE_SERVICE_KEY=eyJ...                      # service_role key

ALLOWED_ORIGINS=http://localhost:3000
```

### 5. Desactivar confirmación de email (desarrollo)

En Supabase → **Authentication → Providers → Email** → desactivar **Confirm email** → **Save**

### 6. Iniciar el servidor

```bash
npm run dev
```

Verificar en: `http://localhost:3000/health` → debe responder `{ "status": "ok" }`

---

## Endpoints

Base URL: `http://localhost:3000/api/v1`

| Método | Ruta             | Descripción               | Auth |
| ------ | ---------------- | ------------------------- | ---- |
| POST   | `/auth/register` | Registrar usuario         | No   |
| POST   | `/auth/login`    | Login, retorna JWT        | No   |
| GET    | `/tasks`         | Listar tareas del usuario | Sí   |
| GET    | `/tasks/:id`     | Obtener tarea por ID      | Sí   |
| POST   | `/tasks`         | Crear tarea               | Sí   |
| PATCH  | `/tasks/:id`     | Actualizar tarea          | Sí   |
| DELETE | `/tasks/:id`     | Eliminar tarea            | Sí   |
| GET    | `/health`        | Health check              | No   |

---

## Prueba rápida (Thunder Client o Postman)

**1. Registrar usuario**

```
POST /api/v1/auth/register
{ "email": "usuario@email.com", "password": "123456" }
```

**2. Login → copiar el token de la respuesta**

```
POST /api/v1/auth/login
{ "email": "usuario@email.com", "password": "123456" }
```

**3. Crear tarea** (header: `Authorization: Bearer <token>`)

```
POST /api/v1/tasks
{ "title": "Mi tarea", "description": "Descripción", "priority": "high" }
```

**4. Ver todas las tareas**

```
GET /api/v1/tasks
Authorization: Bearer <token>
```

**5. Actualizar tarea**

```
PATCH /api/v1/tasks/:id
{ "completed": true, "priority": "low" }
```

**6. Eliminar tarea** → responde `204` sin body

```
DELETE /api/v1/tasks/:id
```

---

## Scripts

```bash
npm run dev    # Desarrollo con hot-reload
npm run build  # Compilar TypeScript
npm start      # Producción (requiere build previo)
npm test       # Tests con cobertura
npm run lint   # Verificar tipos
```

## Docker

```bash
docker build -t api-tasks .
docker run -p 3000:3000 --env-file .env api-tasks
```
