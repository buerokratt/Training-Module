FROM node:22.5.1-alpine

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm install --ignore-scripts

COPY src index.js .env /app/

USER node

EXPOSE 4040

CMD ["npm", "run", "start"]
