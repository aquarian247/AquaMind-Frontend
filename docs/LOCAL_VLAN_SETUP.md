# Local VLAN Architecture Setup on macOS

## Overview
This guide helps you emulate the production DMZ/Protected VLAN architecture locally using Docker and virtualization on your MacBook Pro. You'll run two separate environments:
- **VM1 (Protected VLAN)**: Django API + PostgreSQL in Docker containers
- **VM2 (DMZ)**: React frontend in Docker container

## Prerequisites
- MacBook Pro with sufficient RAM (16GB+ recommended)
- Docker Desktop for Mac
- Virtualization software (choose one):
  - **UTM** (free, ARM/Intel support)
  - **Parallels Desktop** (paid, excellent performance)
  - **VMware Fusion** (paid, good networking features)
  - **VirtualBox** (free, basic but functional)

## Architecture Setup

### Network Configuration
```
┌─────────────────────────────────────────────────────────────────┐
│                        macOS Host                               │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                VM2 (DMZ)                                │    │
│  │           IP: 192.168.100.10                           │    │
│  │                                                         │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │     React Frontend Container                    │    │    │
│  │  │           Port: 3000                           │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────┘    │
│                          │                                      │
│                          │ HTTP API Calls                      │
│                          │ (Port 8000)                         │
│                          ▼                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │            VM1 (Protected VLAN)                        │    │
│  │           IP: 192.168.200.10                           │    │
│  │                                                         │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │     Django API Container                        │    │    │
│  │  │           Port: 8000                           │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │     PostgreSQL Container                        │    │    │
│  │  │           Port: 5432                           │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Step 1: VM Setup

### Option A: Using UTM (Recommended for Apple Silicon)
1. **Download UTM**: https://mac.getutm.app/
2. **Create VM1 (Protected VLAN)**:
   ```
   - OS: Ubuntu Server 22.04 LTS
   - RAM: 4GB
   - Storage: 50GB
   - Network: Host-only (192.168.200.0/24)
   ```
3. **Create VM2 (DMZ)**:
   ```
   - OS: Ubuntu Server 22.04 LTS
   - RAM: 2GB
   - Storage: 30GB
   - Network: Bridged + Host-only (192.168.100.0/24)
   ```

### Option B: Using Parallels Desktop
1. **Create VM1 (Protected VLAN)**:
   ```bash
   # Network: Host-only adapter
   # IP range: 192.168.200.0/24
   ```
2. **Create VM2 (DMZ)**:
   ```bash
   # Network: Shared network + Host-only
   # IP range: 192.168.100.0/24
   ```

## Step 2: Docker Installation on VMs

On both VMs, install Docker:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo apt install docker-compose-plugin -y
```

## Step 3: VM1 (Protected VLAN) Setup

### Django Backend Container Setup
```bash
# Create project directory
mkdir -p ~/aquamind-backend
cd ~/aquamind-backend

# Create Dockerfile for Django
cat > Dockerfile << 'EOF'
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
EOF

# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: aquamind
      POSTGRES_USER: aquamind
      POSTGRES_PASSWORD: aquamind_secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - backend

  django:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DEBUG=True
      - DATABASE_URL=postgresql://aquamind:aquamind_secure_password@postgres:5432/aquamind
      - CORS_ALLOWED_ORIGINS=http://192.168.100.10:3000
    depends_on:
      - postgres
    volumes:
      - .:/app
    networks:
      - backend

volumes:
  postgres_data:

networks:
  backend:
    driver: bridge
EOF

# Set static IP for VM1
sudo ip addr add 192.168.200.10/24 dev eth0
```

### Network Configuration for VM1
```bash
# Configure firewall to only allow DMZ access
sudo ufw enable
sudo ufw allow from 192.168.100.0/24 to any port 8000
sudo ufw deny 8000
```

## Step 4: VM2 (DMZ) Setup

### React Frontend Container Setup
```bash
# Create project directory
mkdir -p ~/aquamind-frontend
cd ~/aquamind-frontend

# Create Dockerfile for React
cat > Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Install serve to run the built app
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Serve the built application
CMD ["serve", "-s", "dist", "-l", "3000"]
EOF

# Create docker-compose.yml for frontend
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - VITE_USE_DJANGO_API=true
      - VITE_DJANGO_API_URL=http://192.168.200.10:8000
      - VITE_DEBUG_MODE=true
    networks:
      - frontend

networks:
  frontend:
    driver: bridge
EOF

# Set static IP for VM2
sudo ip addr add 192.168.100.10/24 dev eth0
```

### Network Configuration for VM2
```bash
# Configure firewall for public access
sudo ufw enable
sudo ufw allow 3000
sudo ufw allow out 8000
```

## Step 5: Environment Configuration

### Create .env files for different environments

**VM1 Django .env:**
```bash
cat > .env << 'EOF'
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://aquamind:aquamind_secure_password@postgres:5432/aquamind

# CORS settings for DMZ frontend
CORS_ALLOWED_ORIGINS=http://192.168.100.10:3000
CORS_ALLOW_CREDENTIALS=True

# Security settings
ALLOWED_HOSTS=192.168.200.10,localhost,127.0.0.1
EOF
```

**VM2 React .env:**
```bash
cat > .env << 'EOF'
VITE_USE_DJANGO_API=true
VITE_DJANGO_API_URL=http://192.168.200.10:8000
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
EOF
```

## Step 6: Testing Network Isolation

### Test connectivity from DMZ to Protected VLAN:
```bash
# From VM2 (DMZ)
curl http://192.168.200.10:8000/api/v1/auth/csrf/
# Should work

# Test direct database access (should fail)
telnet 192.168.200.10 5432
# Should be blocked by firewall
```

### Test external access restrictions:
```bash
# From macOS host, try to access protected VLAN directly
curl http://192.168.200.10:8000/api/v1/auth/csrf/
# Should fail (blocked by firewall)

# Access DMZ frontend (should work)
open http://192.168.100.10:3000
```

## Step 7: Deploy and Test

### Start Protected VLAN services:
```bash
# SSH into VM1
ssh user@192.168.200.10
cd ~/aquamind-backend

# Start services
docker compose up -d

# Check logs
docker compose logs django
docker compose logs postgres
```

### Start DMZ frontend:
```bash
# SSH into VM2
ssh user@192.168.100.10
cd ~/aquamind-frontend

# Copy your React frontend code here
# Start frontend
docker compose up -d

# Check logs
docker compose logs frontend
```

## Step 8: Production Simulation

### Simulate production deployment scenarios:

1. **Rolling Updates**:
   ```bash
   # Update Django without downtime
   docker compose up -d --no-deps django
   ```

2. **Database Backup/Restore**:
   ```bash
   # Backup
   docker compose exec postgres pg_dump -U aquamind aquamind > backup.sql
   
   # Restore
   docker compose exec -T postgres psql -U aquamind aquamind < backup.sql
   ```

3. **SSL/TLS Testing**:
   ```bash
   # Add nginx reverse proxy to DMZ VM
   # Configure SSL certificates
   # Test HTTPS frontend with HTTP backend communication
   ```

## Benefits of This Setup

1. **Realistic Network Isolation**: True network separation between tiers
2. **Security Testing**: Firewall rules and access controls
3. **Deployment Practice**: Docker containerization and orchestration
4. **Troubleshooting**: Network diagnostics and debugging tools
5. **CI/CD Simulation**: Automated deployment pipelines

## Advanced Configurations

### Monitor Network Traffic:
```bash
# Install tcpdump on both VMs
sudo apt install tcpdump

# Monitor API calls from DMZ to Protected VLAN
sudo tcpdump -i any host 192.168.200.10 and port 8000
```

### Load Testing:
```bash
# Install hey for load testing
go install github.com/rakyll/hey@latest

# Test API performance
hey -n 1000 -c 10 http://192.168.200.10:8000/api/v1/infrastructure/geographies/
```

This setup gives you complete control over the deployment architecture and lets you test every aspect of the production environment locally. You'll understand the networking, security, and deployment challenges before working with your operations team.