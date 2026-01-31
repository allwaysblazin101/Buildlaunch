FROM node:18-alpine AS build
WORKDIR /app

# Copy frontend source
COPY frontend/package*.json ./
COPY frontend/ ./

# Install dependencies and build
RUN npm ci --unsafe-perm || npm install
RUN npm run build

# Production image
FROM nginx:stable-alpine
# Remove default nginx html
RUN rm -rf /usr/share/nginx/html/*
# Copy built app
COPY --from=build /app/build /usr/share/nginx/html
# Expose port
EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]
