FROM node:13.5.0-alpine as deps

WORKDIR /app
COPY package.json  ./

RUN npm install && \
  npm cache clean --force 

FROM node:13.10.1-alpine
WORKDIR /app


COPY --from=deps /app/node_modules ./node_modules/
COPY ./prisma ./prisma
COPY ./src ./
COPY .babelrc ./
COPY package.json ./


EXPOSE 5502
