FROM mhart/alpine-node
WORKDIR /app
COPY package.json .
RUN npm install
COPY . ./
CMD npm run start
EXPOSE 3000/tcp
