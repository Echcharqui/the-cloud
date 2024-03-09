require('dotenv').config()
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

// requiring db models
const { User } = require('../../models')

// requiring the rate limiter
const { limiter } = require('../../rate_limiter/rateLImiter')

// requiring middlewares
const { validation } = require('../../middlewares')

// requiring validation schemas
const { registrationSchema, loginSchema } = require('../../validations')

// requiring tokens generator fucntion
const { tokenGenerator, tokensCategories } = require('../../utility')

// register a user
router.post('/v1/register', limiter, validation(registrationSchema), async (req, res) => {

  const { email, password, username } = req.body;

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
    });

    // Save the user to the database (you might want to hash the password before saving)
    await user.save();

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
});

// login a user
router.post('/v1/login', limiter, validation(loginSchema), async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Check if the user exists by email or username
    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { username: identifier.toLowerCase() }]
    }).select('+password'); // Ensure password is included for authentication check
    if (!user) {
      return res.status(401).json({
        statusCode: 401,
        error: {
          message: 'Login Failed. Please check your credentials and try again',
        },
      });
    }

    // Compare the submitted password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        statusCode: 401,
        error: {
          message: 'Login Failed. Please check your credentials and try again',
        },
      });
    }

    // Generate an access token
    const accessToken = await tokenGenerator(user, tokensCategories.authentication);

    // Generate a refresh token
    const refreshToken = await tokenGenerator(user, tokensCategories.refresh);

    // Prepare user data for response, excluding the password
    const { password: omittedPassword, ...userData } = user.toObject({ versionKey: false }); // toObject() is used to convert the mongoose document into a plain JavaScript object

    // Return the user data without the password
    return res.status(200).json({
      user: userData,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      statusCode: 500,
      error: {
        message: 'Server Error. Please try again later',
      },
    });
  }
});


module.exports = router
