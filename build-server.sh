#!/bin/bash

# Navigate to server directory
cd server

# Install dependencies
npm install

# Build the server
npm run build

# Copy necessary files
cp package.json dist/
cp .env dist/

echo "Server build completed successfully!" 