# 🚨 Solución a los Problemas de Book Tracker

## Problemas Identificados

Tu aplicación no está funcionando porque:
1. ❌ **No hay archivo `.env`** con las configuraciones necesarias
2. ❌ **No están instaladas las dependencias** del proyecto
3. ❌ **Prisma Client no está generado**
4. ❌ **No hay conexión a la base de datos**

## 🛠️ Solución Rápida

### Opción 1: Configuración Automática (Recomendada)

Ejecuta el script de configuración que he creado:

```bash
./setup.sh
```

Este script:
- Creará el archivo `.env` desde el ejemplo
- Instalará todas las dependencias
- Generará Prisma Client
- Te guiará para configurar la base de datos

### Opción 2: Configuración Manual

Si prefieres hacerlo paso a paso:

#### 1. Crear archivo `.env`
```bash
cp .env.example .env
```

#### 2. Editar `.env` con tus credenciales reales:
```env
# Base de datos PostgreSQL (puedes usar Railway, Supabase, o local)
DATABASE_URL="postgresql://usuario:password@localhost:5432/booktracker"

# Para desarrollo local
NEXTAUTH_URL="http://localhost:3000"

# Genera un secret seguro con: openssl rand -base64 32
NEXTAUTH_SECRET="tu-secret-seguro-aqui"

# Obtén estos de Google Cloud Console
GOOGLE_CLIENT_ID="tu-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="tu-secret"

MAX_USERS="100"
```

#### 3. Instalar dependencias
```bash
npm install
```

#### 4. Generar Prisma Client
```bash
npx prisma generate
```

#### 5. Crear las tablas en la base de datos
```bash
npx prisma db push
```

#### 6. Iniciar el servidor
```bash
npm run dev
```

## 📝 Configurar Google OAuth

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a "APIs y servicios" > "Credenciales"
4. Crea credenciales > ID de cliente OAuth 2.0
5. Tipo de aplicación: Aplicación web
6. Añade estos URIs:
   - **Orígenes autorizados**: `http://localhost:3000`
   - **URIs de redirección**: `http://localhost:3000/api/auth/callback/google`
7. Copia el Client ID y Client Secret a tu `.env`

## 🗄️ Configurar Base de Datos

### Opción A: PostgreSQL Local
```bash
# Instalar PostgreSQL si no lo tienes
# En Ubuntu/Debian:
sudo apt install postgresql

# Crear base de datos
sudo -u postgres psql
CREATE DATABASE booktracker;
```

### Opción B: Railway (Recomendado para desarrollo rápido)
1. Ve a [Railway.app](https://railway.app)
2. Crea un nuevo proyecto
3. Añade PostgreSQL
4. Copia la DATABASE_URL a tu `.env`

### Opción C: Supabase (Gratis)
1. Ve a [Supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a Settings > Database
4. Copia la Connection String a tu `.env`

## 🧪 Verificar que Todo Funciona

Ejecuta el diagnóstico nuevamente:
```bash
node diagnose.js
```

Deberías ver todos los checkmarks verdes ✅

## 🚀 Iniciar la Aplicación

```bash
npm run dev
```

Abre http://localhost:3000 en tu navegador.

## ❓ ¿Sigues con Problemas?

Si después de seguir estos pasos sigues teniendo problemas:

1. **Revisa la consola del navegador** (F12) para ver errores JavaScript
2. **Revisa los logs del servidor** en la terminal donde ejecutaste `npm run dev`
3. **Verifica que todas las variables de entorno estén correctas**
4. **Asegúrate de que la base de datos esté accesible**

## 💡 Tips Adicionales

- Para generar un NEXTAUTH_SECRET seguro:
  ```bash
  openssl rand -base64 32
  ```

- Para ver los logs de Prisma:
  ```bash
  DEBUG=* npm run dev
  ```

- Para resetear la base de datos:
  ```bash
  npx prisma db push --force-reset
  ```

¡Con estos pasos tu aplicación debería funcionar correctamente! 🎉