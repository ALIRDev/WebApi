FROM node:latest

LABEL maintainer = "Andrea Zago <zago.lux.2011@gmail.com>"

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app/

RUN npm install

COPY . /usr/src/app

EXPOSE 8000
EXPOSE 8001

CMD npm start