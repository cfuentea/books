# Book Tracker 📚

Una aplicación web moderna para gestionar tu biblioteca personal con sistema de registro limitado.

## 🚀 Características

- **Gestión de libros**: Agregar, editar y organizar tu colección personal
- **Búsqueda por código de barras**: Escanea ISBN para agregar libros rápidamente
- **Sistema de registro limitado**: Control de acceso con códigos de invitación
- **Lista de espera**: Sistema para gestionar solicitudes de acceso
- **Autenticación segura**: Integración con Google OAuth
- **Diseño responsive**: Funciona en desktop y móvil

## 🛠️ Tecnologías

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de datos**: PostgreSQL
- **Autenticación**: NextAuth.js
- **UI**: Tailwind CSS, Radix UI, Framer Motion
- **Despliegue**: Railway

## 📦 Instalación

### Prerrequisitos

- Node.js 18+ 
- npm o yarn
- PostgreSQL (o usar Railway)

### Pasos

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/cfuentea/books.git
   cd books
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Editar `.env` con tus configuraciones:
   ```env
   DATABASE_URL="tu-url-de-postgresql"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="tu-secret-key"
   GOOGLE_CLIENT_ID="tu-google-client-id"
   GOOGLE_CLIENT_SECRET="tu-google-client-secret"
   MAX_USERS="100"
   ```

4. **Configurar base de datos**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

## 🔐 Sistema de Registro Limitado

### Configuración

- **Límite de usuarios**: Configurado con `MAX_USERS` en `.env`
- **Códigos de invitación**: Sistema para generar y gestionar invitaciones
- **Lista de espera**: Formulario para usuarios sin acceso

### Administración

Para generar códigos de invitación, usa la API:
```bash
POST /api/admin/invite-codes
{
  "email": "usuario@ejemplo.com", // opcional
  "expiresInDays": 7
}
```

## 🚀 Despliegue

### Railway (Recomendado)

1. Conectar repositorio a Railway
2. Configurar variables de entorno en Railway
3. Deploy automático en cada push

### Variables de entorno en producción

```env
DATABASE_URL="tu-url-de-postgresql"
NEXTAUTH_URL="https://tu-dominio.com"
NEXTAUTH_SECRET="secret-muy-seguro"
GOOGLE_CLIENT_ID="tu-google-client-id"
GOOGLE_CLIENT_SECRET="tu-google-client-secret"
MAX_USERS="100"
```

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── waitlist/          # Página de lista de espera
│   └── page.tsx           # Página principal
├── components/            # Componentes React
│   ├── admin/            # Componentes de administración
│   ├── auth/             # Componentes de autenticación
│   ├── books/            # Componentes de libros
│   └── ui/               # Componentes base
├── lib/                  # Utilidades y configuraciones
│   ├── auth.ts           # Configuración NextAuth
│   ├── invite.ts         # Utilidades de invitación
│   └── prisma.ts         # Cliente Prisma
└── types/                # Definiciones TypeScript
```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Construir para producción
npm run start        # Iniciar en producción
npm run lint         # Verificar código
npm run db:generate  # Regenerar Prisma Client
npm run db:push      # Sincronizar schema
npm run db:studio    # Abrir Prisma Studio
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisar los [Issues](https://github.com/cfuentea/books/issues)
2. Crear un nuevo issue con detalles del problema
3. Contactar al desarrollador

---

Desarrollado con ❤️ por [Carlos Fuentealba](https://github.com/cfuentea)

