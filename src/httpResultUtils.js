const httpResult = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body, null, 2)
});

const invalidParameterHttpResult = name =>
  httpResult(400, { error: `Invalid ${name} provided!` });

const notFoundHttpResult = id => httpResult(404, { error: `${id} not found!` });

const internalErrorHttpResult = errorId =>
  httpResult(500, { error: `An internal error occurred!`, errorId });

const successfullHttpResult = result => httpResult(200, result);

module.exports = {
  httpResult,
  invalidParameterHttpResult,
  notFoundHttpResult,
  internalErrorHttpResult,
  successfullHttpResult
};
