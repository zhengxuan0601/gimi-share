const JsonResult = require('@/utils/httpResponse.unit')
const ShareCircleModel = require('@/models/share_circle.model')
const ShareCircleCommentModel = require('@/models/sharecircle_comment.model')

class ShareCircleCommentController {
  constructor () {
    this.tableName = 'sharecircle_comment'
  }

  /**
   * create circle comment
   * @param {*} req
   * @param {*} response
   */
  async createCircleComment (req, response) {
    try {
      const userId = req.sessionuser.id
      const { circleId, content, replyId, replyComment, topId, replyNickname, replyUserId } = req.body
      const shareCircle = await ShareCircleModel.findOne({ id: circleId })
      if (!shareCircle) {
        return JsonResult.fail({ req, response, message: '友圈不存在' })
      }
      await ShareCircleCommentModel.add({ circleId, content, replyId, replyComment, topId, replyNickname, replyUserId, userId })
      JsonResult.success({
        req,
        response,
        message: '评论成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '评论失败' })
    }
  }

  /**
   * find limi 5 comments
   * @param {*} req
   * @param {*} response
   */
  async findSimpleComments (req, response) {
    try {
      const circleId = req.query.circleId
      const data = await ShareCircleCommentModel.findLimit5(circleId)
      JsonResult.success({
        req,
        response,
        data,
        message: '查询成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '查询失败' })
    }
  }
}

module.exports = new ShareCircleCommentController()
