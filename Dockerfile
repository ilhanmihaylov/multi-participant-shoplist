FROM node:lts-bullseye-slim

RUN mkdir /app

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm i

COPY . .

EXPOSE 3000

ENTRYPOINT ["node", "/app/app.js"]