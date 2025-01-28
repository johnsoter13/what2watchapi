import bodyParser from 'body-parser'
import morgan from 'morgan'

export default (app) => {
  // Add headers before the routes are defined
  app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*')

    // Pass to next layer of middleware
    next()
  })

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))

  app.use(morgan('dev'))
}
