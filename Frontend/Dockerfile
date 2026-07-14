FROM node:22-alpine AS build

WORKDIR  /app

COPY package*.json ./
COPY package-lock*.json ./

RUN npm install

COPY . .


CMD ["npm", "run", "dev"]