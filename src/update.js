const updateHandler = async (_event, _context) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Hello from update function!"
      },
      null,
      2
    )
  };
};

module.exports.default = updateHandler;
