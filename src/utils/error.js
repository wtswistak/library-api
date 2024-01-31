class CustomError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const errorHandler = (error, res) => {
  if (error instanceof CustomError) {
    return res
      .status(error.statusCode)
      .json({ code: error.statusCode, message: error.message });
  } else res.status(500).send("Internal Server Error");
  throw error;
};

module.exports = { CustomError, errorHandler };
