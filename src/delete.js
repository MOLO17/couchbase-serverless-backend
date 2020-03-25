const deleteHandler = async (_event, _context) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Hello from delete function!"
      },
      null,
      2
    )
  };
};

module.exports.default = deleteHandler;
