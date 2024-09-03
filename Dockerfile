FROM node:20.11-alpine

# Set to a non-root built-in user `node`
USER node

# Create app directory (with user `node`)
RUN mkdir -p /home/node/dist/app

WORKDIR /home/node/dist/app

# Install app dependencies
COPY --chown=node package*.json ./
# --chown=node pnpm-lock.yaml ./

# RUN pnpm i --frozen-lockfile
RUN npm install 

# Copy the rest of the application code
COPY --chown=node . .

# Генерация Prisma клиента
RUN npx prisma generate --schema=./apps/user/prisma/schema.prisma

# Сборка приложения
RUN npm run build

# Настройка переменных окружения и порта
ENV PORT=3498
EXPOSE ${PORT}

# Start the application with Prisma migration
CMD ["sh", "-c", "npm prisma:generate && npm start"]
