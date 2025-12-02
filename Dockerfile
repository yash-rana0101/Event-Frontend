# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with clean install for reproducible builds
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Install curl for healthcheck
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create nginx configuration for React SPA
RUN echo 'server { \
    listen 8080; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /health { \
        access_log off; \
        return 200 "healthy\n"; \
        add_header Content-Type text/plain; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Remove default nginx config
RUN rm -f /etc/nginx/conf.d/default.conf.default

# Update nginx.conf to run on port 8080 and as non-root
RUN sed -i 's/listen\s*80;/listen 8080;/' /etc/nginx/conf.d/default.conf && \
    sed -i '/user  nginx;/d' /etc/nginx/nginx.conf && \
    sed -i 's,/var/run/nginx.pid,/tmp/nginx.pid,' /etc/nginx/nginx.conf && \
    sed -i '/http {/a \    client_body_temp_path /tmp/client_temp;\n    proxy_temp_path       /tmp/proxy_temp_path;\n    fastcgi_temp_path     /tmp/fastcgi_temp;\n    uwsgi_temp_path       /tmp/uwsgi_temp;\n    scgi_temp_path        /tmp/scgi_temp;' /etc/nginx/nginx.conf

# Set proper permissions
RUN chown -R appuser:appgroup /usr/share/nginx/html && \
    chown -R appuser:appgroup /var/cache/nginx && \
    chown -R appuser:appgroup /var/log/nginx && \
    chown -R appuser:appgroup /etc/nginx/conf.d && \
    touch /tmp/nginx.pid && \
    chown appuser:appgroup /tmp/nginx.pid

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]