# Frontend Dockerfile (Vite React) - Production
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage with Nginx
FROM nginx:alpine
# Remove default config and add ours (SPA + API proxy)
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html
# Ensure static files are readable by nginx worker (avoid 403 permission denied)
RUN find /usr/share/nginx/html -type d -exec chmod 755 {} \; \
  && find /usr/share/nginx/html -type f -exec chmod 644 {} \;
# Healthcheck (optional basic check)
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/ || exit 1
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
