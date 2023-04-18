FROM node:18-alpine as client
WORKDIR /app
COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
COPY ./.eslintrc.json ./.eslintrc.json
COPY ./client ./client
RUN yarn install
RUN yarn build:client

FROM golang:1.20.2-alpine3.17 as server
WORKDIR /app
COPY . .
RUN cd server && go build -o Admin

FROM golang:1.20.2-alpine3.17
COPY --from=client /app/dist/client ./dist/client
COPY --from=server /app/server/Admin Admin
CMD ["./Admin"]
