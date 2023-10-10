FROM node:19

ENV NODE_ENV development
WORKDIR /usr/src/app

COPY controllers controllers
COPY lib lib
COPY js js
COPY views views
COPY package.json .
COPY server.js .

RUN npm i -g npm@latest
RUN npm install
ENTRYPOINT ["npm","start"]
