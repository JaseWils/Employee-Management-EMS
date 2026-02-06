#!/bin/bash

echo "🚀 Setting up Employee Management System..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Node.js
echo -e "${BLUE}Checking Node.js installation...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js 18 or higher.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v) found${NC}"

# Check MongoDB
echo -e "${BLUE}Checking MongoDB installation...${NC}"
if ! command -v mongod &> /dev/null; then
    echo -e "${RED}MongoDB is not installed. Please install MongoDB.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ MongoDB found${NC}"

# Setup Server
echo -e "${BLUE}Setting up server...${NC}"
cd server
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env file${NC}"
    echo -e "${RED}⚠️  Please update server/.env with your credentials${NC}"
fi

echo -e "${BLUE}Installing server dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Server dependencies installed${NC}"

# Setup Client
echo -e "${BLUE}Setting up client...${NC}"
cd ../client
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✓ Created client .env file${NC}"
fi

echo -e "${BLUE}Installing client dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Client dependencies installed${NC}"

cd ..

echo -e "${GREEN}"
echo "╔════════════════════════════════════════════════╗"
echo "║   ✅ Setup Complete!                          ║"
echo "╚════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${BLUE}Next steps:${NC}"
echo "1. Update server/.env with your credentials"
echo "2. Start MongoDB: mongod"
echo "3. Start server: cd server && npm run dev"
echo "4. Start client: cd client && npm start"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"