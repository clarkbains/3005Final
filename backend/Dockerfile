FROM mhart/alpine-node
RUN apk add dumb-init
RUN apk add sqlite
WORKDIR /app
COPY pkg/package*json ./
RUN npm i
COPY ./pkg/src src
CMD ["node", "src/index.js"]
EXPOSE 80/tcp
