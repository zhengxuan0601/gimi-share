const JsonResult = require('@/utils/httpResponse.unit')
const ShareCircleModel = require('@/models/share_circle.model')
const { transformTree, getSessionuserId } = require('@/utils/common.util')
const ShareCircleCommentModel = require('@/models/sharecircle_comment.model')

class ShareCircleCommentController {
  /**
   * find comments
   * @param {*} req
   * @param {*} response
   */
  async getCommentList (req, response) {
    try {
      const sessionId = await getSessionuserId(req)
      const data = await ShareCircleCommentModel.find(req.query, sessionId)
      const transdata = transformTree(data, 'id', 'topId')
      JsonResult.success({
        req,
        response,
        data: transdata,
        message: '查询评论列表成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '查询评论列表失败' })
    }
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
      const shareCircle = await ShareCircleModel.exists({ id: circleId })
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
      const sessionId = await getSessionuserId(req)
      const data = await ShareCircleCommentModel.findLimit5(circleId, sessionId)
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

  /**
   * delete sharecircle comment
   * @param {*} req
   * @param {*} response
   */
  async deleteComment (req, response) {
    try {
      const userId = req.sessionuser.id
      const id = req.query.id
      const comment = await ShareCircleCommentModel.findOne({ id })
      if (!comment) {
        return JsonResult.fail({ req, response, message: '评论不存在' })
      }
      const shareCircle = await ShareCircleModel.exists({ id: comment.circleId })
      if (comment.userId !== userId && shareCircle.userId !== userId) {
        return JsonResult.httpStatus(req, response, 401, {
          message: 'Authentication failed!',
          code: '9999'
        })
      }
      await ShareCircleCommentModel.delete(id)
      JsonResult.success({
        req,
        response,
        message: '删除成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '删除失败' })
    }
  }
}

module.exports = new ShareCircleCommentController()
