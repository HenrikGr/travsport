const pkg = require('../../package')

/**
 * Application configuration
 * @type {Object}
 */
const config = {
  appName: pkg.name,
  version: pkg.version,
  port: 3000,
  host: 'http://localhost',
  debug: !!process.env.DEBUG,
  environment: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
  mongoUri: 'mongodb://localhost:27017/db',
  mongoOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
}

module.exports = config
