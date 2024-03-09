const validation = (schema) => (req, res, next) => {
  // Validate the request body against the schema
  const { error } = schema.validate(req.body)

  if (error) {
    // If there's an error, send a response with the error details
    return res.status(400).send({
      statusCode: 400,
      error: {
        message: error.details[0].message,
        label: error.details[0].context.label
      }
    })
  } else {
    // If validation passes, continue to the next middleware or route handler
    next()
  }
}

module.exports = validation
