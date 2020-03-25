"use strict";
const {
  successfullHttpResult,
  notFoundHttpResult,
  internalErrorHttpResult
} = require("./httpResultUtils");

const { v4 } = require("uuid");
const { resolve } = require("path");
const couchbase = require("couchbase");

const {
  CLUSTER_USERNAME,
  CLUSTER_PASSWORD,
  CLUSTER_CONNECTION_STRING,
  BUCKET
} = process.env;

const isSecure = CLUSTER_CONNECTION_STRING.startsWith("couchbases://");
const certpath = isSecure
  ? resolve(process.cwd(), "secrets/ca.pem")
  : undefined;

const certpathParam = isSecure ? `?certpath=${certpath}` : "";
`${CLUSTER_CONNECTION_STRING}${certpathParam}`;
const cluster = new couchbase.Cluster(
  `${CLUSTER_CONNECTION_STRING}${certpathParam}`
);

cluster.authenticate(CLUSTER_USERNAME, CLUSTER_PASSWORD);

const bucket = cluster.openBucket(BUCKET);

bucket.on("error", error => {
  console.log("Error from bucket:", JSON.stringify(error, null, 2));
});

const readHandler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const {
    pathParameters: { contactId }
  } = event;

  const documentId = `contact::${contactId}`;

  try {
    const document = await new Promise((resolve, reject) => {
      bucket.get(documentId, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.value);
        }
      });
    });

    return successfullHttpResult(document);
  } catch (error) {
    if (error.code == 13) {
      return notFoundHttpResult(`Contact with id '${contactId}'`);
    }

    const errorId = v4();
    console.log(`Error ${errorId}`, JSON.stringify(error, null, 2));
    return internalErrorHttpResult(errorId);
  }
};

exports.default = readHandler;
