const config = require('config')
const expressSwagger = require('express-swagger-generator')

const options = {
  swaggerDefinition: {
    info: {
      description: 'Gimi Swager Server',
      title: 'Gimi Swager Server',
      version: '1.0.0'
    },
    host: `${config.get('server.host')}:${config.get('server.port')}`,
    basePath: '/api/v1',
    produces: [
      'application/json',
      'application/xml'
    ],
    schemes: ['http', 'https'],
    securityDefinitions: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'accessToken',
        description: ''
      }
    }
  },
  basedir: __dirname,
  files: ['../routes/*.js']
}

module.exports = app => {
  expressSwagger(app)(options)
}
