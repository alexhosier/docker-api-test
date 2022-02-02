# Game API Test

## About this project
This project was designed to be a test seeing how possible it would be to run a small REST API from docker containers that will be used in Unity for items and their metadata.

## How to build
A dockerfile needs to be created in order to build this project, below is the template you can follow to create one with the right environment variables to run this code.
```
FROM node:16.10.0-buster

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

ENV HOST=MYSQL_IP
ENV USER=MYSQL_USER
ENV PASS=MYSQL_PASS
ENV DB=MYSQL_DATABASE
ENV PORT=PORTTORUNON

EXPOSE 8080

CMD ["npm", "start"]
```
