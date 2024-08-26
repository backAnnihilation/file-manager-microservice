FROM node:20.11-alpine

# Set to a non-root built-in user `node`
USER node

# Create app directory (with user `node`)
RUN mkdir -p /home/node/dist/app

WORKDIR /home/node/dist/app

# Install app dependencies
COPY --chown=node package*.json ./
RUN npm install

# Copy application files
COPY --chown=node . .

# Build the app
RUN npm run build

# Set environment variables and expose the port
ENV PORT=3498
EXPOSE ${PORT}

# Start the application with migrations
CMD ["sh", "-c", "npx prisma migrate deploy --schema=./apps/user/prisma/schema.prisma && npm start"]
