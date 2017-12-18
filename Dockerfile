FROM node:latest
MAINTAINER Jhony Pereira
COPY . /var/www
WORKDIR /var/www
RUN npm install
ENTRYPOINT npm start
EXPOSE 8080