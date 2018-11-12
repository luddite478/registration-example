FROM node:10.3
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
ENV usingDocker=true
CMD [ "npm", "start" ]
