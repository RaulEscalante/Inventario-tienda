# Sistema de Inventario

Aplicación web para la gestión de inventario de una tienda, desarrollada con React, Vite, Node.js, Express, Prisma ORM y PostgreSQL.

## Tecnologías utilizadas

**Frontend**
- React
- Vite
- React Router
- Lucide React
- Oxlint

**Backend**
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JSON Web Tokens (JWT)
- bcryptjs

## Requisitos previos

Antes de instalar el proyecto, necesitas:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- Un editor de código, como [Visual Studio Code](https://code.visualstudio.com/)

Se recomienda utilizar una versión de Node.js compatible con Vite 8 y las dependencias del proyecto.

## Clonar el repositorio

Clona el repositorio desde una terminal:

```bash
git clone https://github.com/TU-USUARIO/inventario-tienda.git
cd inventario-tienda
```

Reemplaza `TU-USUARIO` por el usuario u organización correspondiente de GitHub.

## Configuración del backend

### 1. Instalar dependencias

```bash
cd backend
npm ci
```

### 2. Configurar las variables de entorno

Crea un archivo `.env` dentro de `backend`, tomando como referencia `backend/.env.example`.

Configura los valores correspondientes a tu entorno local:

```env
DATABASE_URL="postgresql://USUARIO:CLAVE@localhost:5432/inventario"
JWT_SECRET="REEMPLAZAR_POR_UN_SECRETO_ALEATORIO"
JWT_EXPIRES_IN="8h"
PORT=3000
```

Reemplaza `USUARIO` y `CLAVE` por las credenciales de PostgreSQL de tu computadora.

Genera un valor propio, aleatorio y seguro para `JWT_SECRET`. No utilices el valor de ejemplo en un entorno real.

### 3. Crear la base de datos

Desde PostgreSQL, crea una base de datos con el mismo nombre que aparece en `DATABASE_URL`.

Por ejemplo:

```sql
CREATE DATABASE inventario;
```

Asegúrate de que el usuario configurado en la conexión tenga los permisos necesarios para acceder a la base de datos.

### 4. Aplicar las migraciones

Desde la carpeta `backend`, ejecuta:

```bash
npx prisma migrate deploy
npx prisma generate
```

El primer comando aplica las migraciones existentes en `prisma/migrations`. El segundo genera Prisma Client.

No es necesario crear las tablas manualmente si las migraciones están incluidas y actualizadas en el repositorio.

### 5. Crear el usuario administrador

Ejecuta:

```bash
npm run db:create-admin
```

Este comando ejecuta el script `scripts/create-admin.js`. Consulta sus instrucciones para completar la creación del administrador.

### 6. Iniciar el backend

En modo desarrollo:

```bash
npm run dev
```

Para iniciar el servidor sin Nodemon:

```bash
npm start
```

El backend utiliza el puerto configurado en `PORT`, que en el ejemplo es `3000`.

## Configuración del frontend

### 1. Instalar dependencias

Abre una segunda terminal desde la raíz del proyecto:

```bash
cd frontend
npm ci
```

### 2. Configurar la conexión con el backend

Si el frontend utiliza variables de entorno, crea el archivo `.env` correspondiente a partir de `frontend/.env.example`.

Configura la dirección de la API según las variables que utilice el código del frontend.

No incluyas secretos privados en variables de entorno con prefijo `VITE_`, ya que sus valores pueden quedar expuestos en el navegador.

### 3. Iniciar el frontend

```bash
npm run dev
```

Vite mostrará en la terminal la dirección local para acceder a la aplicación.

## Comandos disponibles

### Backend

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor en desarrollo con Nodemon. |
| `npm start` | Inicia el servidor con Node.js. |
| `npm run db:create-admin` | Ejecuta el script de creación del administrador. |

### Frontend

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia Vite en desarrollo. |
| `npm run build` | Genera la versión de producción. |
| `npm run lint` | Analiza el código con Oxlint. |
| `npm run preview` | Permite previsualizar la compilación de producción. |

## Estructura del proyecto

```text
inventario-tienda/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── scripts/
│   │   └── create-admin.js
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   └── prisma.config.ts
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── context/
│       ├── layouts/
│       ├── pages/
│       ├── routes/
│       └── services/
│   ├── package.json
│   └── vite.config.js
├── .env.example
├── .gitignore
└── README.md
```

## Funcionalidades actuales

- Inicio de sesión y autenticación.
- Gestión de marcas: registrar, modificar, activar, desactivar y buscar.
- Gestión de categorías.
- Gestión de productos.
- Navegación protegida mediante autenticación.

Las funcionalidades se ampliarán conforme avance el desarrollo.

## Consideraciones importantes

- Los archivos `.env` contienen configuraciones locales y no deben subirse al repositorio.
- Los archivos `package-lock.json` deben versionarse para facilitar instalaciones reproducibles.
- Las carpetas `node_modules` no se versionan.
- Las migraciones de Prisma deben mantenerse en Git.
- Cada computadora necesita su propia base de datos y sus propias credenciales.
- No compartas contraseñas, secretos JWT ni credenciales de la base de datos.
