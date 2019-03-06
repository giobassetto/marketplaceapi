const Joi = require('joi')

module.exports = {
  body: {
    email: Joi.string().required(),
    password: Joi.string().required()
  }
}
