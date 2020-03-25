const createHandler = async (_event, _context) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Hello from create function!"
      },
      null,
      2
    )
  };
};

module.exports.default = createHandler;
