FROM node:22-alpine

RUN addgroup -S nonroot \
    && adduser -S nonroot -G nonroot
USER nonroot

ENV NODE_ENV development
WORKDIR /usr/src/app

COPY --chown=nonroot:nonroot . .

RUN npm install
ENTRYPOINT ["npm","start"]
