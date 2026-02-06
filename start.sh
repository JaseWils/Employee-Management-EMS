#!/bin/bash

# Start MongoDB
echo "Starting MongoDB..."
mongod --fork --logpath /var/log/mongodb.log

# Start Server
echo "Starting server..."
cd server
npm run dev &
SERVER_PID=$!

# Wait for server to start
sleep 5

# Start Client
echo "Starting client..."
cd ../client
npm start &
CLIENT_PID=$!

echo ""
echo "✅ EMS is running!"
echo "📡 Server: http://localhost:5800"
echo "🌐 Client: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
wait