# Multi-stage build for AquaMind Frontend

# Stage 1: Build the React app
FROM node:24-slim AS builder
WORKDIR /app

# Build-time config for the SPA.
# NOTE: Vite inlines these into the compiled frontend, so they must be provided
# at build time (docker build args), not only at container runtime.
ARG VITE_DJANGO_API_URL=http://localhost:8000
ARG VITE_USE_DJANGO_API=true
ARG VITE_DEBUG_MODE=false
ENV VITE_DJANGO_API_URL=$VITE_DJANGO_API_URL
ENV VITE_USE_DJANGO_API=$VITE_USE_DJANGO_API
ENV VITE_DEBUG_MODE=$VITE_DEBUG_MODE

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
# Vite outputs to dist/public (see vite.config.ts). Copy that to nginx html root
# so /usr/share/nginx/html/index.html exists (and overrides the nginx default).
COPY --from=builder /app/dist/public /usr/share/nginx/html
RUN chmod -R a+rX /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
# Workflow trigger test - Wed Sep 17 12:42:20 WEST 2025
