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

# Create a complete nginx.conf that works with non-root user
RUN echo 'pid /tmp/nginx.pid; \
events { \
    worker_connections 1024; \
} \
http { \
    client_body_temp_path /tmp/client_temp; \
    proxy_temp_path /tmp/proxy_temp_path; \
    fastcgi_temp_path /tmp/fastcgi_temp; \
    uwsgi_temp_path /tmp/uwsgi_temp; \
    scgi_temp_path /tmp/scgi_temp; \
    include /etc/nginx/mime.types; \
    default_type application/octet-stream; \
    sendfile on; \
    keepalive_timeout 65; \
    gzip on; \
    server { \
        listen 8080; \
        server_name localhost; \
        root /usr/share/nginx/html; \
        index index.html; \
        location / { \
            try_files $uri $uri/ /index.html; \
        } \
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ { \
            expires 1y; \
            add_header Cache-Control "public, immutable"; \
        } \
    } \
}' > /etc/nginx/nginx.conf

# Make sure nginx user can read the config and create temp directories
RUN chown nginx:nginx /etc/nginx/nginx.conf \
    && mkdir -p /tmp/client_temp /tmp/proxy_temp_path /tmp/fastcgi_temp /tmp/uwsgi_temp /tmp/scgi_temp \
    && chown -R nginx:nginx /tmp

# Switch to nginx user for security
USER nginx

# Expose port 8080
EXPOSE 8080

# Start nginx in foreground with custom config
CMD ["nginx", "-g", "daemon off;"]