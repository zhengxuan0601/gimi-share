require('module-alias/register')
require('@/redis')
const chalk = require('chalk')
const config = require('config')
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const userRouter = require('@/routes/user.route')
const articleRouter = require('@/routes/article.route')
const articleCommentRouter = require('@/routes/article_comment.route')
const shareCircleRouter = require('@/routes/share_circle.router')
const unitRouter = require('@/routes/unit.router')
const dynamicsRouter = require('@/routes/dynamics.route')
const browseHistoryRouter = require('@/routes/browse_history.route')
const messageRouter = require('@/routes/message.route')
const shareCircleCommentRouter = require('@/routes/sharecircle_comment.route')
const swaggerInstall = require('@/utils/swagger.unit')

const app = express()
swaggerInstall(app)
app.use(cookieParser())
app.use(bodyParser.json())
app.use(session(config.get('session')))
app.use('/gimishare/api/v1/users', userRouter)
app.use('/gimishare/api/v1/articles', articleRouter)
app.use('/gimishare/api/v1/article/comments', articleCommentRouter)
app.use('/gimishare/api/v1/shares', shareCircleRouter)
app.use('/gimishare/api/v1/unit', unitRouter)
app.use('/gimishare/api/v1/dynamics', dynamicsRouter)
app.use('/gimishare/api/v1/messages', messageRouter)
app.use('/gimishare/api/v1/history', browseHistoryRouter)
app.use('/gimishare/api/v1/sharecircle/comments', shareCircleCommentRouter)
app.listen(config.get('server.port'), () => {
  console.log('app listening on server ' + chalk.green(`http://${config.get('server.host')}:${config.get('server.port')}`))
})
