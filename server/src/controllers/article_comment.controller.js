const ArticleModel = require('@/models/article.model')
const JsonResult = require('@/utils/httpResponse.unit')
const ArticleCommentModel = require('@/models/article_comment.model')
const { transformTree, getSessionuserId } = require('@/utils/common.util')
const MessageModel = require('@/models/message.model')

class CommentController {
  constructor () {
    this.tableName = 'comment'
  }

  /**
   * find comments
   * @param {*} req
   * @param {*} response
   */
  async getCommentList (req, response) {
    try {
      const sessionId = await getSessionuserId(req)
      const data = await ArticleCommentModel.find(req.query, sessionId)
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
   * submit comment
   * @param {*} req
   * @param {*} response
   */
  async createComment (req, response) {
    try {
      const userId = req.sessionuser.id
      const { articleId, uid, replyId, content, replyComment, topId, replyNickname, replyUserId } = req.body
      console.log(uid)
      const existArticle = await ArticleModel.exists({ id: articleId })
      if (!existArticle) {
        return JsonResult.fail({ req, response, message: '文章不存在' })
      }
      if (replyId) {
        const existComment = await ArticleCommentModel.findOne({ id: replyId })
        if (!existComment) {
          return JsonResult.fail({ req, response, message: '所回复评论不存在' })
        }
      }
      await ArticleCommentModel.create({ articleId, replyId, content, userId, replyComment, topId, replyNickname, replyUserId })
      // 评论文章生成消息
      const [sourceUserId, targetUserId, itemType, comment, isReplyComment] = [userId, uid, '4', content, replyComment ? '1' : '0']
      MessageModel.add({ sourceUserId, targetUserId, articleId, itemType, comment, isReplyComment })
      JsonResult.success({
        req,
        response,
        message: '提交成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '提交失败' })
    }
  }

  /**
   * delete comment
   * @param {*} req
   * @param {*} response
   */
  async deleteComment (req, response) {
    try {
      const id = req.query.id
      const userId = req.sessionuser.id
      const comment = await ArticleCommentModel.findOne({ id })
      if (!comment) {
        return JsonResult.fail({ req, response, message: '文章评论不存在' })
      }
      const article = await ArticleModel.exists({ id: comment.articleId })
      // 不属于自己的评论，并且不属于自己文章下的评论无权限删除
      if (comment.userId !== userId && article.userId !== userId) {
        return JsonResult.httpStatus(req, response, 401, {
          message: 'Authentication failed!',
          code: '9999'
        })
      }
      await ArticleCommentModel.delete(id)
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

module.exports = new CommentController()
