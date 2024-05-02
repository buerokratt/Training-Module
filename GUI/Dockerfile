ARG node_version=node:lts
ARG nginx_version=nginx:1.25.4-alpine

FROM $node_version as image
WORKDIR /usr/training-module
COPY ./package*.json ./

FROM image AS build
RUN npm i --legacy-peer-deps --mode=development
COPY . .
RUN ./node_modules/.bin/vite build --mode=development

FROM $nginx_version AS web
COPY ./nginx/http-nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build ./usr/training-module/burokratt /usr/share/nginx/html/training-module
EXPOSE 3001
CMD ["nginx", "-g", "daemon off;"]
