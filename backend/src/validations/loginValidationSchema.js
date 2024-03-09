const Joi = require('joi')

const loginSchema = Joi.object({
  identifier: Joi.alternatives().try(
    Joi.string().email().required().messages({
      'string.email': 'Invalid Email Address',
      'any.required': 'Username or email is required'
    }),
    Joi.string()
      .min(5)
      .max(30)
      // eslint-disable-next-line
      .pattern(new RegExp(/^[A-Za-z0-9]+$/))
      .required()
      .messages({
        'string.min': 'Minimum Character N Requirement',
        'string.pattern.base': 'Letters and Numbers Only',
        'any.required': 'Required Field'
      })
  ),
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(
      // eslint-disable-next-line
      new RegExp(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+-=,.<>;:'"{}\[\]|\\`~?]*$/)
    )
    .required()
    .messages({
      'string.min': 'Minimum Character N Requirement',
      'string.pattern.base': 'Letter and Number Requirement',
      'any.required': 'Required Field'
    })
})

module.exports = { loginSchema }
