FROM node:12.18.1-alpine AS base

WORKDIR /app
COPY package.json  ./

RUN npm install && \
  npm cache clean --force 

FROM node:12.18.1-alpine AS app
WORKDIR /app


COPY --from=base /app/node_modules ./node_modules/
COPY package.json ./
COPY ./prisma ./prisma/
COPY ./src ./src/
COPY .babelrc ./

EXPOSE 5502
