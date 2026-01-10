# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Install all dependencies (including devDependencies for building)
RUN npm ci

COPY . .

# Build the TypeScript code
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install only production dependencies
RUN npm ci --production

# Copy built code from builder
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["npm", "start"]
