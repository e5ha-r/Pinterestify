# Build stage
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# Production stage (Nginx)
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config template
COPY client/nginx.conf /etc/nginx/conf.d/default.conf.template

# Install envsubst for environment variable substitution
RUN apk add --no-cache gettext

# Create startup script
RUN echo '#!/bin/sh\n\
envsubst < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf\n\
nginx -g "daemon off;"\n\
' > /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/docker-entrypoint.sh"]
