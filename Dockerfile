FROM node:12-alpine

ENV PORT=8080

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 8080
CMD node app.js 
