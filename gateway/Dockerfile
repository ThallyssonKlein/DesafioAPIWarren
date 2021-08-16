FROM node:16-alpine3.14

WORKDIR /app

COPY ./src /src
COPY ./.eslintrc.js /.eslintrc.js
COPY ./.prettierrc.cjs /.prettirrc.cjs
COPY ./package.json /package.json

RUN [ "yarn", "install" ]

CMD [ "yarn", "start" ]

EXPOSE 3001
