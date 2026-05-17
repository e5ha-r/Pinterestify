FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY server/package*.json ./

# Install dependencies
RUN npm install --production

# Copy server code
COPY server ./

# Expose port (Railway will set PORT env var)
EXPOSE 8000

# Start server
CMD ["npm", "start"]
