require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const dataconfig = require('./config/database')
const validate = require('express-validation')
const Youch = require('youch')
const Sentry = require('@sentry/node')
const sentryConfig = require('./config/sentry')

class Server {
  constructor () {
    this.express = express()
    this.isDev = process.env.NODE_ENV !== 'production'

    this.sentry()
    this.database()
    this.middlewares()
    this.routes()
    this.exception()
  }
  sentry () {
    Sentry.init(sentryConfig)
  }
  database () {
    mongoose.connect(dataconfig.uri, {
      useCreateIndex: true,
      useNewUrlParser: true
    })
  }

  middlewares () {
    this.express.use(Sentry.Handlers.errorHandler())
    this.express.use(express.json())
  }
  routes () {
    this.express.use(require('./routes'))
  }
  exception () {
    if (process.env.NODE_ENV === 'production') {
      this.express.use(Sentry.Handlers.errorHandler())
    }
    this.express.use(async (err, req, res, next) => {
      if (err instanceof validate.ValidationError) {
        return res.status(err.status).json(err)
      }

      if (process.env.NODE_ENV !== 'production') {
        const youch = new Youch(err, req)

        return res.json(await youch.toJSON())
      }

      return res
        .status(err.status || 500)
        .json({ error: 'Internal Server Error' })
    })
  }
}

module.exports = new Server().express
