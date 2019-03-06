const express = require('express')
const routes = express()
const authMiddleware = require('./app/middlewares/auth')
const validate = require('express-validation')
const validators = require('./app/validators')
const handle = require('express-async-handler')
const controllers = require('./app/controllers')

routes.post(
  '/users',
  validate(validators.User),
  controllers.UserController.store
)
routes.post(
  '/sessions',
  validate(validators.Session),
  handle(controllers.SessionController.store)
)

routes.use(authMiddleware)

routes.get('/ads', handle(controllers.AdController.index))
routes.get('/ads/:id', handle(controllers.AdController.show))
routes.post(
  '/ads',
  validate(validators.Ad),
  handle(controllers.AdController.store)
)
routes.put(
  '/ads/:id',
  validate(validators.Ad),
  handle(controllers.AdController.update)
)
routes.delete('/ads/:id', handle(controllers.AdController.destroy))

// puchase
routes.post(
  '/purchases',
  validate(validators.Purchase),
  handle(controllers.PurchaseController.store)
)
routes.get(
  '/purchases',
  validate(validators.Purchase),
  handle(controllers.PurchaseController.store)
)
routes.put('/purchases/:id', handle(controllers.AcceptController.update))

module.exports = routes
