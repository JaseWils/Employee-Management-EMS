#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════╗"
echo "║   🛑 STOPPING EMS                            ║"
echo "╚═══════════════════════════════════════════════╝"
echo -e "${NC}"

# Kill server
if lsof -Pi :5800 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}Stopping Server...${NC}"
    kill -9 $(lsof -t -i:5800)
    echo -e "${GREEN}✓ Server stopped${NC}"
else
    echo -e "${BLUE}Server not running${NC}"
fi

# Kill client
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}Stopping Client...${NC}"
    kill -9 $(lsof -t -i:3000)
    echo -e "${GREEN}✓ Client stopped${NC}"
else
    echo -e "${BLUE}Client not running${NC}"
fi

echo -e "${GREEN}✓ All services stopped${NC}"