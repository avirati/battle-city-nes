FROM node:10
WORKDIR /usr/src/app
RUN git clone https://github.com/avirati/battle-city-nes ./
RUN yarn
RUN yarn 'single-player'
RUN yarn 'level-designer'
EXPOSE 9000
EXPOSE 9001
CMD ["yarn", "serve"]
