"use strict";

const { v4 } = require("uuid");
const {
  successfullHttpResult,
  internalErrorHttpResult,
  invalidParameterHttpResult
} = require("./httpResultUtils");
const { resolve } = require("path");
const couchbase = require("couchbase");

const EMAIL_REGEX = /^[\w-.]+@[a-z0-9]+([-.][a-z0-9]+)*\.[a-z]{2,}$/i;

const {
  CLUSTER_USERNAME,
  CLUSTER_PASSWORD,
  CLUSTER_CONNECTION_STRING,
  BUCKET
} = process.env;

const certpath = resolve(process.cwd(), "secrets/ca.pem");

const cluster = new couchbase.Cluster(
  `${CLUSTER_CONNECTION_STRING}?certpath=${certpath}`
);

cluster.authenticate(CLUSTER_USERNAME, CLUSTER_PASSWORD);

const bucket = cluster.openBucket(BUCKET);

bucket.on("error", error => {
  console.log("Error from bucket:", JSON.stringify(error, null, 2));
});

const createHandler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const requestBody = JSON.parse(event.body);
  const { id = v4(), name = "", surname = "", email = "" } = requestBody;

  if (typeof name !== "string" || !name.length || name.length > 64) {
    return invalidParameterHttpResult("name");
  }

  if (typeof surname !== "string" || !surname.length || surname.length > 64) {
    return invalidParameterHttpResult("surname");
  }

  if (
    typeof email !== "string" ||
    (email.length && (email.length > 64 || !EMAIL_REGEX.test(email)))
  ) {
    return invalidParameterHttpResult("email");
  }

  const document = {
    id,
    name,
    surname,
    email,
    type: "Contact"
  };

  const documentId = `contact::${id}`;

  try {
    const documentInserted = await new Promise((resolve, reject) => {
      bucket.insert(documentId, document, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({ ...result, ...document });
        }
      });
    });
    console.log("Remaining time: ", context.getRemainingTimeInMillis());
    return successfullHttpResult(documentInserted);
  } catch (error) {
    const errorId = v4();
    console.log(`Error ${errorId}`, JSON.stringify(error, null, 2));
    console.log("Remaining time: ", context.getRemainingTimeInMillis());
    return internalErrorHttpResult(errorId);
  }
};

module.exports.default = createHandler;
