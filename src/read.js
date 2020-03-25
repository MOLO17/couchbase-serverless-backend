const readHandler = async (_event, _context) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Hello from read function!"
      },
      null,
      2
    )
  };
};

exports.default = readHandler;
