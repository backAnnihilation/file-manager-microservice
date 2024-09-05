FROM node:20.11-alpine

USER root

RUN npm install -g pnpm

USER node

RUN mkdir -p /home/node/dist/app

WORKDIR /home/node/dist/app

COPY --chown=node package*.json ./ 
COPY --chown=node pnpm-lock.yaml ./

RUN pnpm install

ENV PORT=3507

COPY --chown=node . .

RUN npx prisma generate --schema=./apps/user/prisma/schema.prisma

RUN npx prisma migrate deploy --schema=./apps/user/prisma/schema.prisma

RUN pnpm run build

EXPOSE ${PORT}


ENV ENV=TESTING
ENV GOOGLE_CAPTURE_SECRET=6LcXfikqAAAAAAsHDkBJ1frq_DBvqq7jKtgOObJA
ENV CAPTURE_SITE_KEY=6LcXfikqAAAAAEtJf27WMmB70tR2xlm2A3Jlgz6P
ENV DATABASE_URL_FOR_TESTS="postgresql://userdb:qwerty123@localhost:5433/postgresdb?schema=public"
ENV DATABASE_URL="postgres://avnadmin:AVNS_C_w6bSq7j6bueOavIug@pg-ebf4a9a-commonbackmail-5fad.f.aivencloud.com:11550/defaultdb?sslmode=require"
ENV ACCESS_TOKEN_SECRET=ACCESS_TOKEN_SECRET_KEY
ENV REFRESH_TOKEN_SECRET=jwt_refresh_secret_KEY
ENV DATABASE_LOCAL_URL="postgresql://userdb:qwerty123@localhost:5433/postgresdb?schema=public"
ENV POSTGRES_USER=userdb
ENV POSTGRES_PASSWORD=qwerty123
ENV POSTGRES_PORT=5433
ENV DATABASE_NAME=postgresdb
ENV EMAIL_PASSWORD="jhnt xkje pyxx cldg"
ENV EMAIL_USER=kr4mboy@gmail.com
ENV EMAIL_SERVICE=gmail
ENV BASIC_AUTH_USERNAME=admin
ENV BASIC_AUTH_PASSWORD=qwerty
ENV OAUTH_GOOGLE_REDIRECT_URL=http://localhost:9876/auth/google/redirect
ENV OAUTH_GITHUB_CLIENT_ID=213
ENV OAUTH_GITHUB_CLIENT_SECRET=123
ENV OAUTH_GITHUB_REDIRECT_URL=123

CMD ["pnpm", "start"]
