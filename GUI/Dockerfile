FROM node:22.0.0-alpine AS image
WORKDIR /app
COPY ./package.json .

FROM image AS build
RUN npm install --legacy-peer-deps --mode=development --ignore-scripts
COPY . .
RUN ./node_modules/.bin/vite build --mode=development
VOLUME /app

FROM nginx:1.27-alpine AS web
COPY ./nginx/http-nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build ./app/build/assets /usr/share/nginx/html/training-module/training/assets
COPY --from=build ./app/build/index.html /usr/share/nginx/html/training-module
RUN apk add --no-cache bash
COPY ./nginx/scripts/env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh
EXPOSE 3001

ENTRYPOINT [ "bash", "/docker-entrypoint.d/env.sh" ]
