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
- Run GUI in your local machine: `npm run dev`
- Docker-compose.yml
  - ruuter -> use commented out image to test the following:
    - Intent into Service
    - Intent example into Intent
  
Ready to go: **docker-compose up -d**

# Testing

## Bürokratt Play

> Bürokratt Play acts the same as `dev` environment. Play gets updated after new code commits reach `main` branch, so the result can be faulty and/or down at any given time.

http://play.buerokratt.ee:3104/treening/treening/teemad
