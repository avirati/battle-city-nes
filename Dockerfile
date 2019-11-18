FROM node:10
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn
COPY . .
RUN yarn 'single-player'
RUN yarn 'level-designer'
EXPOSE 9000
EXPOSE 9001
CMD ["yarn", "serve"]
