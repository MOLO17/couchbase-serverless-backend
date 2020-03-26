FROM ideavate/amazonlinux-node:12

WORKDIR /couchbase

COPY package.json ./
COPY package-lock.json ./

VOLUME /couchbase/node_modules

CMD [ "npm", "install" ]
