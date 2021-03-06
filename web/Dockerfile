FROM node:12.20.0-buster-slim

RUN mkdir -p /app

COPY package*.json /app/

WORKDIR /app

RUN npm install

COPY . /app

# and build
RUN npm run build