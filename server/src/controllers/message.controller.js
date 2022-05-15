const MessageModel = require('@/models/message.model')
const JsonResult = require('@/utils/httpResponse.unit')

class MessageController {
  /**
   * find user message list
   * @param {*} req
   * @param {*} response
   */
  async findMessageList (req, response) {
    try {
      const targetUserId = req.sessionuser.id
      const data = await MessageModel.find({ ...req.body, targetUserId })
      JsonResult.success({
        req,
        response,
        data,
        message: '查询消息列表成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '查询失败' })
    }
  }

  /**
   * find user noread message count
   * @param {*} req
   * @param {*} response
   */
  async findNoReadTotal (req, response) {
    try {
      const targetUserId = req.sessionuser.id
      const haveRead = '0'
      const allCount = await MessageModel.total({ targetUserId, haveRead })
      const commentCount = await MessageModel.total({ targetUserId, haveRead, itemType: '4' })
      const agreeCount = await MessageModel.total({ targetUserId, haveRead, itemType: '1' })
      const focusCount = await MessageModel.total({ targetUserId, haveRead, itemType: '3' })
      const collectCount = await MessageModel.total({ targetUserId, haveRead, itemType: '2' })
      JsonResult.success({
        req,
        response,
        data: {
          allCount,
          commentCount,
          agreeCount,
          focusCount,
          collectCount
        },
        message: '查询消息数量成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '查询失败' })
    }
  }
}

module.exports = new MessageController()
