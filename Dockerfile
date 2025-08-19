# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY bun.lockb ./

# Install dependencies (using bun since you have bun.lockb)
RUN npm install -g bun && bun install

# Copy source code
COPY . .

# Build the project
RUN bun run build

# Production stage
FROM nginx:1.24-alpine

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Switch to nginx user for security
USER nginx

# Expose port 8080
EXPOSE 80