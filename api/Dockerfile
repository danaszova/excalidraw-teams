# Backend API Dockerfile
FROM node:18-alpine

WORKDIR /api

# Copy package files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3001

# Start development server with tsx watch
CMD ["npm", "run", "dev"]
