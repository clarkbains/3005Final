FROM mhart/alpine-node
WORKDIR /app
RUN apk add dumb-init yarn
RUN npm install -g serve
COPY package.json .
RUN yarn install
COPY . ./
CMD ["./init.sh"]
EXPOSE 3000/tcp
