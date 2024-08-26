FROM node:20.11-alpine

# Set to a non-root built-in user `node`
USER node

# Create app directory (with user `node`)
RUN mkdir -p /home/node/dist/app

WORKDIR /home/node/dist/app

# Install app dependencies
COPY --chown=node package*.json ./
RUN npm install

# Apply Prisma migrations
COPY --chown=node . .
RUN npx prisma migrate deploy --schema=./apps/user/prisma/schema.prisma

# Build the app
RUN npm run build

# Set environment variables and expose the port
ENV PORT=3498
EXPOSE ${PORT}

# Start the application
CMD [ "npm", "start" ]