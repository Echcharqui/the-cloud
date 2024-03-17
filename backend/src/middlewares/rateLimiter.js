const rateLimit = require('express-rate-limit')

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 4, // Limit each IP to 4 requests per windowMs
  message: { // Custom message to be sent when rate limit is reached
    statusCode: 429,
    error: {
      message: 'Too many requests, please try again later'
    }
  }
})

module.exports = rateLimiter
