FROM node:8.1.2-slim
RUN apt-get update && apt-get install -y python python-dev python-pip 

ARG UID
ARG GID

RUN mkdir -p /app

COPY package.json /app/

WORKDIR /app

VOLUME ["/app/dist"]
RUN npm install
COPY . /app

RUN chown $GID /app -R
