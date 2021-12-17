FROM mhart/alpine-node
RUN apk add dumb-init
WORKDIR /app
COPY package*json ./
RUN npm i
COPY ./src src
CMD ["node", "src/index.js"]
EXPOSE 80/tcp
