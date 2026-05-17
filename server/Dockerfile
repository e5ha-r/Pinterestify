FROM node:18-alpine

WORKDIR /app

# Copy backend only
COPY server/package*.json ./
RUN npm install

COPY server ./

EXPOSE 8000

CMD ["node", "index.js"]
