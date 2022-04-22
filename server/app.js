require('module-alias/register')
const chalk = require('chalk')
const config = require('config')
const express = require('express')
const bodyParser = require('body-parser')
const userRouter = require('@/routes/user.route')
const swaggerInstall = require('@/middleware/swagger.middleware')
const app = express()

swaggerInstall(app)
app.use(bodyParser.json())
app.use('/api/v1/users', userRouter)

app.listen(config.get('server.port'), () => {
  console.log('app listening on server ' + chalk.green(`http://${config.get('server.host')}:${config.get('server.port')}`))
})
