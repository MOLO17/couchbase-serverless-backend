"use strict";

const readHandler = async (event, _context) => {
  const {
    pathParameters: { contactId }
  } = event;

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `Hello ${contactId}!`
      },
      null,
      2
    )
  };
};

exports.default = readHandler;
