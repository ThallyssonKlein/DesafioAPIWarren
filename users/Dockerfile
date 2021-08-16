FROM node:16-alpine3.14

COPY ./src /src
COPY ./.eslintrc.js /.eslintrc.js
COPY ./.prettierrc.cjs /.prettirrc.cjs
COPY ./package.json /package.json

RUN [ "yarn", "install" ]

CMD [ "yarn", "start" ]

EXPOSE 8052
