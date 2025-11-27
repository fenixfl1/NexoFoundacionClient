# Build stage
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copiar archivos de build
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar plantilla config y script
COPY config.template.json /usr/share/nginx/html/
COPY entrypoint.sh /entrypoint.sh

# Cambiar permisos y establecer entrypoint
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
