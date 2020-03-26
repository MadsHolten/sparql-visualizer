FROM node:13-alpine

WORKDIR /usr/src/app

RUN apk update && \
    apk upgrade && \
    apk add --no-cache bash git gcc make python

COPY ./package.json /usr/src/app/package.json

RUN npm install