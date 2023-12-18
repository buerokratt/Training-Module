FROM node:20-alpine
RUN apk add --no-cache chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

ENV NODE_ENV development
WORKDIR /usr/src/app

COPY controllers controllers
COPY lib lib
COPY js js
COPY views views
COPY package.json .
COPY server.js .

RUN npm i -g npm@9.5.0
RUN npm install
ENTRYPOINT ["npm","start"]
