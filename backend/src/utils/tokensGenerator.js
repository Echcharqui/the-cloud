require('dotenv').config()
const jwt = require('jsonwebtoken')

// requiring the tokens categorys
const { tokensCategories } = require('./tokensCategories')

const tokenGenerator = async (user, catagory) => {
  switch (catagory) {
    case tokensCategories.authentication: {
      const token = jwt.sign(
        {
          userId: user._id
        },
        process.env.JWT_AUTH_SECRET,
        {
          expiresIn: '7d' // Expires in 15 minutes
        }
      )
      return token
    }

    case tokensCategories.refresh: {
      const token = jwt.sign(
        {
          userId: user._id
        },
        process.env.JWT_REFRESH_SECRET,
        {
          expiresIn: '30d' // Expires in 30 days
        }
      )
      return token
    }

    default:
      break
  }
}

module.exports = { tokenGenerator }
