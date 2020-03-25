"use strict";

const { successfullHttpResult } = require("./httpResultUtils");

const deleteHandler = async (event, _context) => {
  const {
    pathParameters: { contactId }
  } = event;

  return successfullHttpResult({ message: `Delete ${contactId}!` });
};

module.exports.default = deleteHandler;
