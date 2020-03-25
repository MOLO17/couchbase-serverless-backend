"use strict";

const { v4 } = require("uuid");
const {
  successfullHttpResult,
  invalidParameterHttpResult
} = require("./httpResultUtils");

const EMAIL_REGEX = /^[\w-.]+@[a-z0-9]+([-.][a-z0-9]+)*\.[a-z]{2,}$/i;

const createHandler = async (event, _context) => {
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

  return successfullHttpResult(document);
};

module.exports.default = createHandler;
