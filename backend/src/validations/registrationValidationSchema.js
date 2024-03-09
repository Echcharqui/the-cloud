const Joi = require('joi')

const registrationSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Invalid Email Address',
      'any.required': 'Required Field'
    }),
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
    }),
  username: Joi.string()
    .min(5)
    .max(30)
    .pattern(
      // eslint-disable-next-line
      new RegExp(/^[A-Za-z0-9]+$/)
    )
    .required()
    .messages({
      'string.min': 'Minimum Character N Requirement',
      'string.pattern.base': 'Letters and Numbers Only',
      'any.required': 'Required Field'
    })
})

module.exports = { registrationSchema }
