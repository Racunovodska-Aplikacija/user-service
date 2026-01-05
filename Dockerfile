FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install all dependencies (including devDependencies for building)
RUN npm ci

COPY . .

# Build the TypeScript code
RUN npm run build

# Remove devDependencies to reduce image size
RUN npm prune --production

EXPOSE 3000

CMD ["npm", "start"]
