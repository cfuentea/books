#!/bin/bash

echo "🚀 Configuración inicial de Book Tracker"
echo "========================================"

# Colores para los mensajes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Verificar si existe .env
if [ ! -f .env ] && [ ! -f .env.local ]; then
    echo -e "\n${YELLOW}📋 Creando archivo .env...${NC}"
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${GREEN}✅ Archivo .env creado desde .env.example${NC}"
        echo -e "${YELLOW}⚠️  IMPORTANTE: Edita el archivo .env con tus credenciales reales${NC}"
        echo "   Necesitas:"
        echo "   1. URL de tu base de datos PostgreSQL"
        echo "   2. Credenciales de Google OAuth (desde Google Cloud Console)"
        echo "   3. Un secret seguro para NextAuth (puedes generar uno con: openssl rand -base64 32)"
    else
        echo -e "${RED}❌ No se encontró .env.example${NC}"
    fi
else
    echo -e "${GREEN}✅ Archivo .env ya existe${NC}"
fi

# 2. Instalar dependencias
echo -e "\n${YELLOW}📦 Instalando dependencias...${NC}"
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencias instaladas correctamente${NC}"
else
    echo -e "${RED}❌ Error al instalar dependencias${NC}"
    exit 1
fi

# 3. Generar Prisma Client
echo -e "\n${YELLOW}🔧 Generando Prisma Client...${NC}"
npx prisma generate
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Prisma Client generado${NC}"
else
    echo -e "${RED}❌ Error al generar Prisma Client${NC}"
    exit 1
fi

# 4. Verificar conexión a la base de datos
echo -e "\n${YELLOW}🗄️  Verificando conexión a la base de datos...${NC}"
echo "   (Este paso fallará si no has configurado DATABASE_URL en .env)"

# 5. Preguntar si desea crear las tablas
echo -e "\n${YELLOW}¿Deseas crear/actualizar las tablas en la base de datos? (s/n)${NC}"
read -r response
if [[ "$response" =~ ^([sS][iI]|[sS])$ ]]; then
    npx prisma db push
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Base de datos configurada${NC}"
    else
        echo -e "${RED}❌ Error al configurar la base de datos${NC}"
        echo -e "${YELLOW}   Asegúrate de que DATABASE_URL esté correctamente configurado en .env${NC}"
    fi
fi

echo -e "\n${GREEN}🎉 Configuración completada!${NC}"
echo -e "\n${YELLOW}Próximos pasos:${NC}"
echo "1. Edita el archivo .env con tus credenciales reales"
echo "2. Si no lo has hecho, crea una base de datos PostgreSQL"
echo "3. Configura Google OAuth en Google Cloud Console"
echo "4. Ejecuta: npm run dev para iniciar el servidor"
echo -e "\n${GREEN}¡Listo para desarrollar! 🚀${NC}"