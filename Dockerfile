FROM node:latest
ENV Note /app
RUN mkdir -pv Note
WORKDIR Note
ADD . Note
ENV NODE_ENV production
ENV NPM_CONFIG_LOGLEVEL warn

RUN npm install
