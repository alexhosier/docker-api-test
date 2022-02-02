# Game API Test

## About this project
This project was designed to be a test seeing how possible it would be to run a small REST API from docker containers that will be used in Unity for items and their metadata.

## Dockerfile
A dockerfile needs to be created in order to build this project
```
FROM node:16.10.0-buster

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

ENV HOST=YOURIP
ENV USER=gameapi
ENV PASS=PASSWORD
ENV DB=gameapi
ENV PORT=8080

EXPOSE 8080

CMD ["npm", "start"]
```
