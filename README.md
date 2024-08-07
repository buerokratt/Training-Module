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

### TIM

To be able to log in locally, manually create a cookie called `customJwtCookie` in the browser. Fill with the contents of the response:

```
curl -X POST -H "Content-Type: application/json" -d '{
  "login": "EE30303039914",
  "password": ""
}' http://localhost:8080/auth/login
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

In ./DSL/OpenSearch
- To Initialize Open Search run `./deploy-opensearch.sh <URL> <AUTH> <Is Mock Allowed - Default false>`
- To Use Opensearch locally run `./deploy-opensearch.sh http://localhost:9200 admin:admin true`

In ./DSL/Pipelines
- To populate OpenSearch with Rasa YAML files run `./init_with_mocks.sh http://localhost:3010`

### Docker related (local development)

- Comment out training_gui in docker-comose.yml
- Run GUI in your local machine, from GUI folder: `npm run dev`
- Everything else `docker-compose up -d`

### Use external components(Header/Main Navigation).

Currently, Header and Main Navigation used as external components, they are defined as dependency in package.json

```
 "@buerokrat-ria/header": "^0.0.1"
 "@buerokrat-ria/menu": "^0.0.1"
 "@buerokrat-ria/styles": "^0.0.1"
```

# Testing

## Bürokratt Play

> Bürokratt Play acts the same as `dev` environment. Play gets updated after new code commits reach `main` branch, so the result can be faulty and/or down at any given time.

https://admin.play.buerokratt.ee/training

### Notes

##### Ruuter Internal Requests

- When running ruuter either on local or in an environment make sure to adjust `- application.internalRequests.allowedIPs=127.0.0.1,{YOUR_IPS}` under ruuter environments




### Kubernetes deployment
For production deploying on kubernetes use this the variable [`REACT_APP_MENU_JSON`](https://github.com/buerokratt/NoOps/blob/dev/Kubernetes/Modules/Training-Module/templates/deployment-byk-training-gui.yaml) with the value:
```
"[{\"id\":\"conversations\",\"label\":{\"et\":\"Vestlused\",\"en\":\"Conversations\"},\"path\":\"/chat\",\"children\":[{\"label\":{\"et\":\"Vastamata\",\"en\":\"Unanswered\"},\"path\":\"/unanswered\"},{\"label\":{\"et\":\"Aktiivsed\",\"en\":\"Active\"},\"path\":\"/active\"},{\"label\":{\"et\":\"Ootel\",\"en\":\"Pending\"},\"path\":\"/pending\"},{\"label\":{\"et\":\"Ajalugu\",\"en\":\"History\"},\"path\":\"/history\"}]},{\"id\":\"training\",\"label\":{\"et\":\"Treening\",\"en\":\"Training\"},\"path\":\"/training\",\"children\":[{\"label\":{\"et\":\"Treening\",\"en\":\"Training\"},\"path\":\"/training\",\"children\":[{\"label\":{\"et\":\"Teemad\",\"en\":\"Themes\"},\"path\":\"/training/intents\"},{\"hidden\":true,\"label\":{\"et\":\"Avalikud teemad\",\"en\":\"Public themes\"},\"path\":\"/training/common-intents\"},{\"label\":{\"et\":\"Teemade järeltreenimine\",\"en\":\"Post training themes\"},\"path\":\"/training/intents-followup-training\"},{\"label\":{\"et\":\"Vastused\",\"en\":\"Answers\"},\"path\":\"/training/responses\"},{\"label\":{\"et\":\"Kasutuslood\",\"en\":\"User Stories\"},\"path\":\"/training/stories\"},{\"hidden\":true,\"label\":{\"et\":\"Konfiguratsioon\",\"en\":\"Configuration\"},\"path\":\"/training/configuration\"},{\"label\":{\"et\":\"Vormid\",\"en\":\"Forms\"},\"path\":\"/training/forms\"},{\"label\":{\"et\":\"Mälukohad\",\"en\":\"Slots\"},\"path\":\"/training/slots\"},{\"hidden\":true,\"label\":{\"et\":\"Automatic Teenused\",\"en\":\"Automatic Services\"},\"path\":\"/auto-services\"}]},{\"label\":{\"et\":\"Ajaloolised vestlused\",\"en\":\"Historical conversations\"},\"path\":\"/history\",\"children\":[{\"label\":{\"et\":\"Ajalugu\",\"en\":\"History\"},\"path\":\"/history/history\"},{\"hidden\":true,\"label\":{\"et\":\"Pöördumised\",\"en\":\"Appeals\"},\"path\":\"/history/appeal\"}]},{\"label\":{\"et\":\"Mudelipank ja analüütika\",\"en\":\"Modelbank and analytics\"},\"path\":\"/analytics\",\"children\":[{\"label\":{\"et\":\"Teemade ülevaade\",\"en\":\"Overview of topics\"},\"path\":\"/analytics/overview\"},{\"label\":{\"et\":\"Mudelite võrdlus\",\"en\":\"Comparison of models\"},\"path\":\"/analytics/models\"},{\"hidden\":true,\"label\":{\"et\":\"Testlood\",\"en\":\"testTracks\"},\"path\":\"/analytics/testcases\"}]},{\"label\":{\"et\":\"Treeni uus mudel\",\"en\":\"Train new model\"},\"path\":\"/train-new-model\"}]},{\"id\":\"analytics\",\"label\":{\"et\":\"Analüütika\",\"en\":\"Analytics\"},\"path\":\"/analytics\",\"children\":[{\"label\":{\"et\":\"Ülevaade\",\"en\":\"Overview\"},\"path\":\"/overview\"},{\"label\":{\"et\":\"Vestlused\",\"en\":\"Chats\"},\"path\":\"/chats\"},{\"label\":{\"et\":\"Tagasiside\",\"en\":\"Feedback\"},\"path\":\"/feedback\"},{\"label\":{\"et\":\"Nõustajad\",\"en\":\"Advisors\"},\"path\":\"/advisors\"},{\"label\":{\"et\":\"Avaandmed\",\"en\":\"Reports\"},\"path\":\"/reports\"}]},{\"id\":\"services\",\"hidden\":true,\"label\":{\"et\":\"Teenused\",\"en\":\"Services\"},\"path\":\"/services\",\"children\":[{\"label\":{\"et\":\"Ülevaade\",\"en\":\"Overview\"},\"path\":\"/overview\"},{\"label\":{\"et\":\"Uus teenus\",\"en\":\"New Service\"},\"path\":\"/newService\"},{\"label\":{\"et\":\"Automatic Teenused\",\"en\":\"Automatic Services\"},\"path\":\"/auto-services\"},{\"label\":{\"et\":\"Probleemsed teenused\",\"en\":\"Faulty Services\"},\"path\":\"/faultyServices\"}]},{\"id\":\"settings\",\"label\":{\"et\":\"Haldus\",\"en\":\"Administration\"},\"path\":\"/settings\",\"children\":[{\"label\":{\"et\":\"Kasutajad\",\"en\":\"Users\"},\"path\":\"/users\"},{\"label\":{\"et\":\"Vestlusbot\",\"en\":\"Chatbot\"},\"path\":\"/chatbot\",\"children\":[{\"label\":{\"et\":\"Seaded\",\"en\":\"Settings\"},\"path\":\"/chatbot/settings\"},{\"label\":{\"et\":\"Tervitussõnum\",\"en\":\"Welcome message\"},\"path\":\"/chatbot/welcome-message\"},{\"label\":{\"et\":\"Välimus ja käitumine\",\"en\":\"Appearance and behavior\"},\"path\":\"/chatbot/appearance\"},{\"label\":{\"et\":\"Erakorralised teated\",\"en\":\"Emergency notices\"},\"path\":\"/chatbot/emergency-notices\"}]},{\"label\":{\"et\":\"Asutuse tööaeg\",\"en\":\"Office opening hours\"},\"path\":\"/working-time\"},{\"label\":{\"et\":\"Sessiooni pikkus\",\"en\":\"Session length\"},\"path\":\"/session-length\"}]},{\"id\":\"monitoring\",\"hidden\":true,\"label\":{\"et\":\"Seire\",\"en\":\"Monitoring\"},\"path\":\"/monitoring\",\"children\":[{\"label\":{\"et\":\"Aktiivaeg\",\"en\":\"Working hours\"},\"path\":\"/uptime\"}]}]"
```
like this:
```
            - name: REACT_APP_MENU_JSON
              value: "[{\"id\":\"conversations\",\"label\":{\"et\":\"Vestlused\",\"en\":\"Conversations\"},\"path\":\"/chat\",\"children\":[{\"label\":{\"et\":\"Vastamata\",\"en\":\"Unanswered\"},\"path\":\"/unanswered\"},{\"label\":{\"et\":\"Aktiivsed\",\"en\":\"Active\"},\"path\":\"/active\"},{\"label\":{\"et\":\"Ootel\",\"en\":\"Pending\"},\"path\":\"/pending\"},{\"label\":{\"et\":\"Ajalugu\",\"en\":\"History\"},\"path\":\"/history\"}]},{\"id\":\"training\",\"label\":{\"et\":\"Treening\",\"en\":\"Training\"},\"path\":\"/training\",\"children\":[{\"label\":{\"et\":\"Treening\",\"en\":\"Training\"},\"path\":\"/training\",\"children\":[{\"label\":{\"et\":\"Teemad\",\"en\":\"Themes\"},\"path\":\"/training/intents\"},{\"hidden\":true,\"label\":{\"et\":\"Avalikud teemad\",\"en\":\"Public themes\"},\"path\":\"/training/common-intents\"},{\"label\":{\"et\":\"Teemade järeltreenimine\",\"en\":\"Post training themes\"},\"path\":\"/training/intents-followup-training\"},{\"label\":{\"et\":\"Vastused\",\"en\":\"Answers\"},\"path\":\"/training/responses\"},{\"label\":{\"et\":\"Kasutuslood\",\"en\":\"User Stories\"},\"path\":\"/training/stories\"},{\"hidden\":true,\"label\":{\"et\":\"Konfiguratsioon\",\"en\":\"Configuration\"},\"path\":\"/training/configuration\"},{\"label\":{\"et\":\"Vormid\",\"en\":\"Forms\"},\"path\":\"/training/forms\"},{\"label\":{\"et\":\"Mälukohad\",\"en\":\"Slots\"},\"path\":\"/training/slots\"},{\"hidden\":true,\"label\":{\"et\":\"Automatic Teenused\",\"en\":\"Automatic Services\"},\"path\":\"/auto-services\"}]},{\"label\":{\"et\":\"Ajaloolised vestlused\",\"en\":\"Historical conversations\"},\"path\":\"/history\",\"children\":[{\"label\":{\"et\":\"Ajalugu\",\"en\":\"History\"},\"path\":\"/history/history\"},{\"hidden\":true,\"label\":{\"et\":\"Pöördumised\",\"en\":\"Appeals\"},\"path\":\"/history/appeal\"}]},{\"label\":{\"et\":\"Mudelipank ja analüütika\",\"en\":\"Modelbank and analytics\"},\"path\":\"/analytics\",\"children\":[{\"label\":{\"et\":\"Teemade ülevaade\",\"en\":\"Overview of topics\"},\"path\":\"/analytics/overview\"},{\"label\":{\"et\":\"Mudelite võrdlus\",\"en\":\"Comparison of models\"},\"path\":\"/analytics/models\"},{\"hidden\":true,\"label\":{\"et\":\"Testlood\",\"en\":\"testTracks\"},\"path\":\"/analytics/testcases\"}]},{\"label\":{\"et\":\"Treeni uus mudel\",\"en\":\"Train new model\"},\"path\":\"/train-new-model\"}]},{\"id\":\"analytics\",\"label\":{\"et\":\"Analüütika\",\"en\":\"Analytics\"},\"path\":\"/analytics\",\"children\":[{\"label\":{\"et\":\"Ülevaade\",\"en\":\"Overview\"},\"path\":\"/overview\"},{\"label\":{\"et\":\"Vestlused\",\"en\":\"Chats\"},\"path\":\"/chats\"},{\"label\":{\"et\":\"Tagasiside\",\"en\":\"Feedback\"},\"path\":\"/feedback\"},{\"label\":{\"et\":\"Nõustajad\",\"en\":\"Advisors\"},\"path\":\"/advisors\"},{\"label\":{\"et\":\"Avaandmed\",\"en\":\"Reports\"},\"path\":\"/reports\"}]},{\"id\":\"services\",\"hidden\":true,\"label\":{\"et\":\"Teenused\",\"en\":\"Services\"},\"path\":\"/services\",\"children\":[{\"label\":{\"et\":\"Ülevaade\",\"en\":\"Overview\"},\"path\":\"/overview\"},{\"label\":{\"et\":\"Uus teenus\",\"en\":\"New Service\"},\"path\":\"/newService\"},{\"label\":{\"et\":\"Automatic Teenused\",\"en\":\"Automatic Services\"},\"path\":\"/auto-services\"},{\"label\":{\"et\":\"Probleemsed teenused\",\"en\":\"Faulty Services\"},\"path\":\"/faultyServices\"}]},{\"id\":\"settings\",\"label\":{\"et\":\"Haldus\",\"en\":\"Administration\"},\"path\":\"/settings\",\"children\":[{\"label\":{\"et\":\"Kasutajad\",\"en\":\"Users\"},\"path\":\"/users\"},{\"label\":{\"et\":\"Vestlusbot\",\"en\":\"Chatbot\"},\"path\":\"/chatbot\",\"children\":[{\"label\":{\"et\":\"Seaded\",\"en\":\"Settings\"},\"path\":\"/chatbot/settings\"},{\"label\":{\"et\":\"Tervitussõnum\",\"en\":\"Welcome message\"},\"path\":\"/chatbot/welcome-message\"},{\"label\":{\"et\":\"Välimus ja käitumine\",\"en\":\"Appearance and behavior\"},\"path\":\"/chatbot/appearance\"},{\"label\":{\"et\":\"Erakorralised teated\",\"en\":\"Emergency notices\"},\"path\":\"/chatbot/emergency-notices\"}]},{\"label\":{\"et\":\"Asutuse tööaeg\",\"en\":\"Office opening hours\"},\"path\":\"/working-time\"},{\"label\":{\"et\":\"Sessiooni pikkus\",\"en\":\"Session length\"},\"path\":\"/session-length\"}]},{\"id\":\"monitoring\",\"hidden\":true,\"label\":{\"et\":\"Seire\",\"en\":\"Monitoring\"},\"path\":\"/monitoring\",\"children\":[{\"label\":{\"et\":\"Aktiivaeg\",\"en\":\"Working hours\"},\"path\":\"/uptime\"}]}]"
```
