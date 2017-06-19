import historyApiFallback from 'connect-history-api-fallback'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import {chalkSuccess} from '../tools/chalkConfig'
import config from '../webpack.config.dev'
import express from 'express'
import bodyParser from 'body-parser'
import authRoutes from './auth'
import apiRoutes from './api'
import passport from 'passport'

// Database
import Schema from '../data/schema';
import Functions from '../data/functions';

const localSignupStrategy = require('./passport/local-signup')
const localLoginStrategy = require('./passport/local-login')
const authCheckMiddleware = require('./middleware/auth-check')
const me = require('./me')

const port = process.env.PORT || 4000
const bundler = webpack(config)
const app = express()
console.log(chalkSuccess('Starting Express server...'))

app.use(express.static('src'))
app.use('/resources', express.static('src/resources'))
app.use('/audios', express.static('audios'))

// express 4
app.use(bodyParser.json({
  limit: '100mb'
}))
app.use(bodyParser.urlencoded({
  limit: '100mb',
  extended: true
}))

// pass the passport middleware
app.use(passport.initialize())

// load passport strategies
passport.use('local-signup', localSignupStrategy)
passport.use('local-login', localLoginStrategy)

// pass the authentication checker middleware
app.use('/me', authCheckMiddleware)
app.use('/me', me);

// DB
var db = Schema;
var query = Functions(app, db);

// Routes
authRoutes(app)
apiRoutes(app, db, query)

app.use(historyApiFallback())
app.use(webpackHotMiddleware(bundler))
app.use(webpackDevMiddleware(bundler, {
    // Dev middleware can't access config, so we provide publicPath
  publicPath: config.output.publicPath,

    // These settings suppress noisy webpack output so only errors are displayed to the console.
  noInfo: false,
  quiet: false,
  stats: {
    assets: false,
    colors: true,
    version: false,
    hash: false,
    timings: false,
    chunks: false,
    chunkModules: false
  }

    // for other settings see
    // http://webpack.github.io/docs/webpack-dev-middleware.html
}))

app.listen(port)
console.log(chalkSuccess('Express server is listening on port: ' + port))
