FROM node:5-slim

ARG UID
ARG GID

RUN groupadd jenkins --gid=$GID && useradd jenkins --uid=$UID --gid=$GID --create-home --shell=/bin/sh ;\
    mkdir -p /app

EXPOSE 3000
COPY package.json /app/

WORKDIR /app

RUN npm install --production ; npm cache clear

COPY . /app
run chown jenkins:jenkins /app -R
