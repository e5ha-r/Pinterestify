# Base image
FROM node:18

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port (Railway will override if needed)
EXPOSE 5050

# Start server
CMD ["npm", "run", "dev"]
