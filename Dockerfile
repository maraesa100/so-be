# from base image node
FROM node:12.18.1
ENV NODE_ENV=production

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json .

RUN npm install

COPY ./ .

EXPOSE 3070

CMD ["npm","start"]