# Multi-stage build for AquaMind Frontend

# Stage 1: Build the React app
FROM node:24-slim AS builder
WORKDIR /app

# Install system dependencies needed for native builds
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Clean npm cache and remove any existing node_modules
RUN npm cache clean --force

# Install all dependencies (including dev dependencies needed for build)
RUN npm ci

# Copy source code
COPY . .

# Build only the client-side application (skip server build that's causing issues)
RUN npx vite build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
# Workflow trigger test - Wed Sep 17 12:42:20 WEST 2025
