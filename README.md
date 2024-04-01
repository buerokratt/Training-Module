# Bürokratt's Training Module

Bürokratt's Training Module is a tool to help primarily customer support agents and service managers to create, edit and otherwise manipulate Bürokratt's e-services via a graphical user interface. This includes setting up Ruuter- and Rasa-based user stories, making X-road / REST / database requests where and when appropriate and so forth.

Technically, it is a service combined of different generic technical components, meaning that there is no custom Training Module component as such.

# Scope

This repo will primarily contain

1. Architectural and other documentation;
2. Docker Compose file to set up and run Bürokratt's Training Module as a fully functional service;
3. Tests specific to Bürokratt's Training Module.

---

## Notes for the Developers

### Docker related (local development)

- Clone [TIM](https://github.com/buerokratt/TIM)
- Go to src -> main -> resources -> application.properties & modify security.allowlist.jwt value to `security.allowlist.jwt=ruuter,resql,resql_users,tim,tim-postgresql,node_server,data_mapper,gui_dev,127.0.0.1,::1`
- Navigate to TIM and build the image `docker build -t tim .`

- Run GUI in your local machine: `npm run dev`
- Docker-compose.yml
  - ruuter -> use commented out image to test the following:
    - Intent into Service
    - Intent example into Intent

Ready to go: **docker-compose up -d**

### Use external components(Header/Main Navigation).

Currently, Header and Main Navigation used as external components, they are defined as dependency in package.json

```
 "@buerokrat-ria/header": "^0.0.1"
 "@buerokrat-ria/menu": "^0.0.1"
 "@buerokrat-ria/styles": "^0.0.1"
```

### DMapper issue

- To build DataMapper docker image on Apple silicon processors change its [Dockerfile](/DSL/DataMapper/Dockerfile) as following:

```
FROM node:19-alpine

RUN apk add --no-cache chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

....
```

### Open Search

- To Initialize Open Search run `./deploy-opensearch.sh <URL> <AUTH> <Is Mock Allowed - Default false>`
- To Use Opensearch locally run `./deploy-opensearch.sh http://localhost:9200 admin:admin true`

# Testing

## Bürokratt Play

> Bürokratt Play acts the same as `dev` environment. Play gets updated after new code commits reach `main` branch, so the result can be faulty and/or down at any given time.

https://admin.play.buerokratt.ee/training

### TIM

- if you are running `Locally` then you need to curl the login request or run it on postman first to create and store the cookie in TIM and then on the browser create the cookie manually in the browser with name `customJwtCookie` and the value return from the curl
  request is as follows:

```
curl -X POST -H "Content-Type: application/json" -d '{
  "login": "EE30303039914",
  "password": ""
}' http://localhost:8085/login-user
```
