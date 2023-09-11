FROM node:20-alpine

# Create app directory
WORKDIR /meu-clube-back/

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]
