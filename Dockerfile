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

# RUN cd prisma && npx prisma migrate save --experimental 
# RUN cd prisma && npx prisma migrate up --experimental 
# RUN cd prisma && npx prisma generate 

EXPOSE 5502
