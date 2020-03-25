FROM ideavate/amazonlinux-node:12

RUN yum install -y tar gzip bzip2 zip

WORKDIR /couchbase

COPY package.json ./

VOLUME /couchbase/node_modules

CMD [ "npm", "install" ]
