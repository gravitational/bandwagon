FROM node:8.11.2-slim

RUN mkdir -p /app

COPY package*.json /app/

WORKDIR /app

RUN npm install

COPY . /app

# and build
RUN npm run build