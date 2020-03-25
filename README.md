# Serverless backend example with couchbase

This project is a simple CRUD serverless backend written in nodejs that uses couchbase as database.

## Prerequisites

In order to run the project in your environment you need:

- A couchbase cluster (preferably tls enabled):
  - ca.pem (if tls enabled);
  - the cluster connection string;
  - a bucket;
  - the credentials to access the bucket.
- An AWS account.

In order to compile and deploy this project you need:

- [Node.js](https://nodejs.org/);
- [Docker](https://www.docker.com/);
- [Serverless](https://serverless.com/): configured with your aws credentials.

## Project structure

The project is structured as following:

- `layers`: contains the configuration files needed to build and deploy a lambda layer with couchbase node sdk v2.6.11;
- `secrets`: contains the CA used to connect securely to the couchbase cluster;
- `src`: contains the lambdas.

The `.env` and the `ca.pem` are crypted with [git secret](https://git-secret.io/).

## Environment variables

The following variables are required:

- `CLUSTER_USERNAME`;
- `CLUSTER_PASSWORD`;
- `CLUSTER_CONNECTION_STRING`;
- `BUCKET`.

With the `serverless-dotenv-plugin` all of the environmnet variables will be loaded with the `.env` in the project root.

## Lambda layer

In this example we're using [Lambda Layers](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html) to store the couchbase sdk.

### Why?

The couchbase node sdk is not a pure js module, in fact it uses the underlying C SDK.
In order to properly setup the sdk for the lambda we need to run `npm install` on an amazon-linux OS like.
For this purpose we can use Docker to install the `node_modules` and serverless to store them in a lambda layer.
In this way we can continue to change and deploy the lambda code **without** building each time the couchbase sdk.

### How?

Under the `layers` folder we can find the [serverless.yaml](layers/serverless.yaml), which defines the `couchbase-node-sdk-2-6-11` layer. This layer loads the `couchbase` folder.
It's mandatory to run `npm run-script build` and `npm run-script install-couchbase` inside the `couchbase` folder, in order to build the docker image and run a container. Once run, you must see the `nodejs/node_modules` folder full with the couchbase dependencies.
In order to deploy the lambda layer, just run the `serverless deploy` on the `layers` folder.

## Deploy

Once you have deployed the lambda layer, you can deploy the backend.
Be sure to install all the node dependencies with `npm install` on the project root, than you can run the `serverless deploy`.

## CRUD APIs

Once the deployed the backend consists of 4 APIs:

- Create a new contact with `POST /`:
  - body: `{ "name": "", "surname": "", "email": ""}`;
- Retrieve a contact with `GET /{contactId}`;
- Update a contact with `PUT /{contactId}`;
- Delete a contact with `DELETE /{contactId}`.

The contact model has the following attributes:

- **name**: required, at most 64 chars;
- **surname**: required, at most 64 chars;
- **email**: optional, valid email with at most 64 chars.
