require('dotenv').config()
const express = require('express')
const router = express.Router()

// requiring middlewares
const { validation, authenticate, outOfService, rateLimiter } = require('../../middlewares')

// requiring validation schemas
const { registrationSchema, loginSchema } = require('../../validations')

// requiring db models
const authController = require('../../controllers/auth/authController')

// register a user
router.post('/v1/register', rateLimiter, outOfService, validation(registrationSchema), authController.registration)
// login a user
router.post('/v1/login', rateLimiter, validation(loginSchema), authController.login)
// refresh the accesse token when it get expired
router.post('/v1/refresh-token', authController.refreshToken)
// check the user authentication
router.get('/v1/check-auth', authenticate, authController.checkAuth)
// log out
router.post('/v1/logout', authenticate, authController.logOut)

module.exports = router
