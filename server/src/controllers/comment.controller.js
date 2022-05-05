const CommentModel = require('@/models/comment.model')
const JsonResult = require('@/utils/httpResponse.unit')
const ArticleModel = require('@/models/article.model')
const { transformTree } = require('@/utils/common.util')

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
      const data = await CommentModel.find(req.query)
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
      const { articleId, replyId, content, replyComment, topId, replyNickname } = req.body
      if (articleId) {
        const existArticle = await ArticleModel.findOne({ id: articleId })
        if (!existArticle) {
          return JsonResult.fail({ req, response, message: '文章不存在' })
        }
      }
      if (replyId) {
        const existComment = await CommentModel.findOne({ id: replyId })
        if (!existComment) {
          return JsonResult.fail({ req, response, message: '所回复评论不存在' })
        }
      }
      await CommentModel.create({ articleId, replyId, content, userId, replyComment, topId, replyNickname })
      if (articleId) {
        ArticleModel.autoIncre(articleId, 'commentCounts')
      }
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
      const comment = await CommentModel.findOne({ id, userId })
      if (!comment) {
        return JsonResult.httpStatus(req, response, 401, {
          message: 'Authentication failed!',
          code: '9999'
        })
      }
      await CommentModel.delete(id)
      if (comment.articleId) {
        ArticleModel.autoDec(comment.articleId, 'commentCounts')
      }
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
