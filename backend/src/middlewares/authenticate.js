require('dotenv').config()
const jwt = require('jsonwebtoken')
const { User } = require('../models')

const authenticate = async (req, res, next) => {
  try {
    const accessToken = req.header('Authorization').replace('Bearer ', '')

    if (!accessToken) {
      return res.status(401).json({
        statusCode: 401,
        error: {
          message: 'Authentication failed. Access token is missing'
        }
      })
    }

    try {
      // Verify the refresh token and create a new access token
      const payload = jwt.verify(accessToken, process.env.JWT_AUTH_SECRET)

      // find user and check if the user exist
      const user = await User.findOne({ _id: payload.userId })

      if (!user) {
        return res.status(401).json({
          statusCode: 401,
          error: {
            message: 'Authentication failed. User not found'
          }
        })
      }

      req.user = user
      next()
    } catch (error) {
      return res.status(401).json({
        statusCode: 401,
        error: {
          message: 'Authentication failed. Invalid or expired access token'
        }
      })
    }
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      statusCode: 500,
      error: {
        message: 'Server Error. Please try again later'
      }
    })
  }
}

module.exports = authenticate
