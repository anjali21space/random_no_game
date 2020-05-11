FROM node:10

# create working directory
RUN mkdir -p /usr/src/game

WORKDIR /usr/src/game

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied

COPY package*.json /usr/src/game/

RUN npm install

# Bundle app source
COPY . /usr/src/game/

EXPOSE 8080

CMD ["node", "app.js"]