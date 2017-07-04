FROM node:5-slim

ARG UID
ARG GID

RUN mkdir -p /app

COPY package.json /app/

WORKDIR /app

RUN npm install --production ; npm cache clear

VOLUME ["/app/dist"]

COPY . /app

RUN groupadd builder --gid=$GID  -o 
RUN useradd builder --uid=$UID --gid=$GID --create-home --shell=/bin/bash 
RUN chown builder /app -R
