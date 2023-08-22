# DataMapper

Testing handlebars and javascript functionality.

## Docker

To run the application using docker run:

```
docker-compose up -d
```

## Handlebars

Handlebars files go to `views` directory.

Example on how to access handlebars in browser:

```
http://localhost:3000/hbs/my/restful/url/myFile
```

## Javascript

Javascript files go to `js` directory.

Example on how to access javascript files in browser:

```
http://localhost:3000/js/my/restful/url/myScript
```

_Note!_ URL must not end with `.js` extension.

## Apple Silicon

If your are building the docker file for apple silicon please change

`FROM node:19`

To

```
FROM node:19-alpine
RUN apk add --no-cache chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
```
