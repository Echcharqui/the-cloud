const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { User } = require('../../models')

// requiring tokens generator and tokens types object
const { tokenGenerator, tokensCategories } = require('../../utils')

// registartion controller
exports.registration = async (req, res) => {
  const { email, password, username } = req.body

  try {
    // Check if the email or username already exists
    const emailExists = await User.findOne({ email })
    const usernameExists = await User.findOne({ username: username.toLowerCase() })
    if (emailExists) {
      return res.status(400).send({
        statusCode: 400,
        error: {
          message: 'Email Already in Use',
          label: 'email'
        }
      })
    }
    if (usernameExists) {
      return res.status(400).send({
        statusCode: 400,
        error: {
          message: 'Username Already in Use',
          label: 'username'
        }
      })
    }
    // Create new user
    const user = new User({
      email,
      password,
      username
    })

    // Save the user to the database (you might want to hash the password before saving)
    await user.save()

    // Return success response
    return res.status(201).send({ message: 'Registration successful', email, username })
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

// login controller
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body

    // Check if the user exists by email or username
    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { username: identifier.toLowerCase() }]
    }).select('+password') // Ensure password is included for authentication check
    if (!user) {
      return res.status(401).json({
        statusCode: 401,
        error: {
          message: 'Échec de la connexion. Veuillez vérifier vos identifiants et essayer à nouveau !'
        }
      })
    }

    // Compare the submitted password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({
        statusCode: 401,
        error: {
          message: 'Échec de la connexion. Veuillez vérifier vos identifiants et essayer à nouveau !'
        }
      })
    }

    // Generate an access token
    const accessToken = await tokenGenerator(user, tokensCategories.authentication)

    // Generate a refresh token
    const refreshToken = await tokenGenerator(user, tokensCategories.refresh)

    // Prepare user data for response, excluding the password
    const { password: omittedPassword, ...userData } = user.toObject({ versionKey: false }) // toObject() is used to convert the mongoose document into a plain JavaScript object

    // Return the user data without the password
    return res.status(200).json({
      user: userData,
      accessToken,
      refreshToken
    })
  } catch (err) {
    console.error(err)

    return res.status(500).json({
      statusCode: 500,
      error: {
        message: 'Server Error. Please try again later'
      }
    })
  }
}

// refreshing access token controller
exports.refreshToken = async (req, res) => {
  // Read the refresh token from the HttpOnly cookie
  const { refreshToken } = req.body

  // in case they was not token in the request
  if (!refreshToken) {
    return res.status(401).json({
      statusCode: 401,
      error: {
        message: 'Authentication failed. Refresh token is missing'
      }
    })
  }

  try {
    // Verify the refresh token and create a new access token
    await jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (error, payload) => {
      // check if their is an error
      if (error) {
        return res.status(401).json({
          statusCode: 401,
          error: {
            message: 'operation failed, token is invalid or expired'
          }
        })
      } else {
        //  find user and check if the user exist
        const user = await User.findOne({ _id: payload.userId })

        if (!user) {
          return res.status(401).json({
            statusCode: 401,
            error: {
              message: 'operation failed, token is invalid or expired'
            }
          })
        }

        // filtring the user object from sensitive  data
        // Prepare user data for response, excluding the password
        const { password: omittedPassword, ...userData } = user.toObject({ versionKey: false }) // toObject() is used to convert the mongoose document into a plain JavaScript object

        // generate a new access token
        const newAccessToken = await tokenGenerator(userData, tokensCategories.authentication)

        // Return the user data
        return res.status(201).json({
          accessToken: newAccessToken
        })
      }
    })
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

// check authentification validity
exports.checkAuth = (req, res) => {
  // Prepare user data for response, excluding the password
  const { password: omittedPassword, ...userData } = req.user.toObject({ versionKey: false }) // toObject() is used to convert the mongoose document into a plain JavaScript object

  return res.status(200).json(userData)
}

// logout controler
exports.logOut = async (req, res) => {
  try {
    return res.status(201).json({
      message: 'Logout successful'
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      error: {
        message: 'Server Error. Please try again later'
      }
    })
  }
}
