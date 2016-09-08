FROM node:5-slim

ARG UID
ARG GID

RUN mkdir -p /app

EXPOSE 3000

COPY package.json /app/

WORKDIR /app

RUN npm install --production ; npm cache clear

VOLUME ["/app/dist"]

COPY . /app
