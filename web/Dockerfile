FROM node:12.18.3-stretch-slim

RUN mkdir -p /app

COPY package*.json /app/

WORKDIR /app

RUN npm install

COPY . /app

# and build
RUN npm run build