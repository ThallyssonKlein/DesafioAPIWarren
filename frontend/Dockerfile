FROM node:16-alpine3.14

WORKDIR /app

COPY ./src /src
COPY ./.eslintrc.json /.eslintrc.json
COPY ./package.json /package.json

RUN [ "yarn", "install" ]

CMD [ "yarn", "start" ]

EXPOSE 3000
