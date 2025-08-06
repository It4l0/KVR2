# Estágio de construção
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
RUN npm install -g ts-node-dev
RUN npm install --save-dev @types/express @types/cors
COPY . .
RUN npm run build

# Estágio de produção
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
RUN npm install -g ts-node-dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src
COPY --from=builder /app/.env ./
COPY --from=builder /app/tsconfig.json ./

EXPOSE 3000
CMD ["npm", "run", "dev"]
