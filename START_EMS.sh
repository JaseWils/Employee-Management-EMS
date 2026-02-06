#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════╗"
echo "║   🚀 EMS STARTUP SCRIPT                      ║"
echo "╚═══════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if MongoDB is running
echo -e "${YELLOW}Checking MongoDB...${NC}"
if pgrep -x "mongod" > /dev/null
then
    echo -e "${GREEN}✓ MongoDB is running${NC}"
else
    echo -e "${RED}✗ MongoDB is not running${NC}"
    echo -e "${YELLOW}Starting MongoDB...${NC}"
    mongod --fork --logpath /var/log/mongodb.log
    sleep 2
    echo -e "${GREEN}✓ MongoDB started${NC}"
fi

# Check if server is already running
if lsof -Pi :5800 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}Server already running on port 5800${NC}"
    echo -e "${YELLOW}Killing existing process...${NC}"
    kill -9 $(lsof -t -i:5800)
    sleep 1
fi

# Check if client is already running
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${YELLOW}Client already running on port 3000${NC}"
    echo -e "${YELLOW}Killing existing process...${NC}"
    kill -9 $(lsof -t -i:3000)
    sleep 1
fi

# Start Server
echo -e "${BLUE}Starting Server...${NC}"
cd server
npm run dev > server.log 2>&1 &
SERVER_PID=$!
echo -e "${GREEN}✓ Server started (PID: $SERVER_PID)${NC}"
sleep 3

# Start Client
echo -e "${BLUE}Starting Client...${NC}"
cd ../client
BROWSER=none npm start > client.log 2>&1 &
CLIENT_PID=$!
echo -e "${GREEN}✓ Client started (PID: $CLIENT_PID)${NC}"
sleep 3

echo -e "${GREEN}"
echo "╔═══════════════════════════════════════════════╗"
echo "║   ✅ EMS IS RUNNING!                         ║"
echo "╠═══════════════════════════════════════════════╣"
echo "║   📡 Server: http://localhost:5800           ║"
echo "║   🌐 Client: http://localhost:3000           ║"
echo "║                                               ║"
echo "║   Server PID: $SERVER_PID                           ║"
echo "║   Client PID: $CLIENT_PID                           ║"
echo "╚═══════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${YELLOW}Opening browser...${NC}"
sleep 2
if command -v xdg-open > /dev/null; then
    xdg-open http://localhost:3000
elif command -v open > /dev/null; then
    open http://localhost:3000
else
    echo -e "${YELLOW}Please open http://localhost:3000 in your browser${NC}"
fi

echo -e "${BLUE}To stop the servers, run: ./STOP_EMS.sh${NC}"

# Keep script running
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
wait