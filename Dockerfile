FROM node:14-slim
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
RUN chown node:node /usr/src/app
COPY --chown=node:node package*.json /usr/src/app/
RUN npm install --prod
COPY . .
EXPOSE 8080
CMD [ "node", "main.js" ]
