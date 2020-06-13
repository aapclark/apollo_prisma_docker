FROM node:14.4.0-alpine as deps

WORKDIR /app
COPY package.json  ./

RUN npm install && \
  npm cache clean --force 

FROM node:14.4.0-alpine as app
WORKDIR /app


COPY --from=deps /app/node_modules ./node_modules/
COPY package.json ./
COPY ./prisma ./prisma/
COPY ./src ./src/
COPY .babelrc ./

# RUN cd prisma && npx prisma migrate save --experimental 
# RUN cd prisma && npx prisma migrate up --experimental 
# RUN cd prisma && npx prisma generate 

EXPOSE 5502
