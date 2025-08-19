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

# Create nginx user directories and set permissions
RUN mkdir -p /var/cache/nginx/client_temp \
    /var/cache/nginx/proxy_temp \
    /var/cache/nginx/fastcgi_temp \
    /var/cache/nginx/uwsgi_temp \
    /var/cache/nginx/scgi_temp \
    /var/run \
    && chown -R nginx:nginx /var/cache/nginx \
    && chown -R nginx:nginx /var/run \
    && chmod -R 755 /var/cache/nginx \
    && chmod -R 755 /var/run

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create custom nginx config that works with non-root user
RUN echo 'server { \
    listen 8080; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Switch to nginx user for security
USER nginx

# Expose port 8080
EXPOSE 8080

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]