const MessageModel = require('@/models/message.model')
const JsonResult = require('@/utils/httpResponse.unit')

class MessageController {
  async findMessageList (req, response) {
    try {
      const data = await MessageModel.find(req.body)
      JsonResult.success({
        req,
        response,
        data,
        message: '查询用户列表成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '查询失败' })
    }
  }
}

module.exports = new MessageController()
