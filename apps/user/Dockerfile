FROM node:18

WORKDIR /home/node/app

RUN npm install -g pnpm

COPY package*.json ./

RUN pnpm install

ENV PORT=9876

COPY . .

RUN pnpm build

EXPOSE ${PORT}

CMD ["pnpm", "start:dev"]