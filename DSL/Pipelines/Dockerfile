FROM node:20

ENV NODE_ENV development
WORKDIR /usr/src/app

COPY . .

RUN npm install
ENTRYPOINT ["npm","start"]
