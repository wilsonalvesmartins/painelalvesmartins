# 1. Build do React Frontend
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2. Produção (Servidor Final)
FROM node:18-alpine
# Instala o Nginx dentro do contêiner Node
RUN apk add --no-cache nginx

WORKDIR /app

# Copia dependências do backend e o script Node
COPY package*.json ./
RUN npm install --production
COPY server.js ./

# Copia o Build do React para a pasta do Nginx
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/http.d/default.conf

# Criação do script de inicialização para rodar Node e Nginx juntos
RUN echo -e '#!/bin/sh\nnginx\nnode server.js' > /app/start.sh
RUN chmod +x /app/start.sh

EXPOSE 80
CMD ["/app/start.sh"]
