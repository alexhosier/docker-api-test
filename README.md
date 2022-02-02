# Game API Test

## About this project
This project was designed to be a test seeing how possible it would be to run a small REST API from docker containers that will be used in Unity for items and their metadata.

## How to build
A dockerfile needs to be created in order to build this project, below is the template you can follow to create one with the right environment variables to run this code.
```dockerfile
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

For the API to work it uses a MySQL database, down below is the SQL query required to generate all of the fields used by this API.
```sql
CREATE TABLE IF NOT EXISTS `items` (
  `item_name` varchar(50) DEFAULT NULL,
  `item_quantity` int(11) DEFAULT NULL,
  `item_price` int(11) DEFAULT NULL,
  `item_uniqueid` varchar(50) DEFAULT NULL,
  UNIQUE KEY `item_uniqueid` (`item_uniqueid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

To build run this command

```
docker build -t yourname/buildname .
```

And to run the docker image you can execute

```
docker run -p localport:globalport yourname/buildname
```

## Endpoints

### /
The root endpoint, returns info about the API, no API key required.

#### GET
This returns a JSON string with API information
```json
{
  "api_name": "Game API",
  "api_version": "1.0.0"
}
```

### /items
This is an endpoint for all the items in the MySQL DB, an API key is required, this can be accuired in the index.js file.

#### GET

Headers: 
- x-api-key: You api key
