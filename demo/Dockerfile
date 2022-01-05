FROM node:14.0
RUN npm install webpack -g && npm i typescript -g
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install
RUN npm run build
EXPOSE 3000
ENTRYPOINT node ./compiledTS/server/server.js
