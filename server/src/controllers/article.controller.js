const ArticleModel = require('@/models/article.model')
const JsonResult = require('@/utils/httpResponse.unit')
const DynamicsModel = require('@/models/dynamics.model')
const { getSessionuserId } = require('@/utils/common.util')
const UserCollectArticleModel = require('@/models/user_collect_article.model')

class ArticleController {
  /**
   * search articles
   * @param {*} req
   * @param {*} response
   */
  async getAllArticles (req, response) {
    try {
      const sessionId = await getSessionuserId(req)
      const data = await ArticleModel.find(req.query, sessionId)
      JsonResult.success({
        req,
        response,
        data,
        message: '查询文章列表成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '查询文章列表失败' })
    }
  }

  /**
   * search articleInfo
   * @param {*} req
   * @param {*} response
   */
  async getArticleInfo (req, response) {
    try {
      const articleId = req.query.id
      const sessionId = await getSessionuserId(req)
      const data = await ArticleModel.findOne(articleId, sessionId)
      await ArticleModel.autoIncre(articleId, 'viewCounts')
      JsonResult.success({
        req,
        response,
        data,
        message: '查询文章详情成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '查询文章详情失败' })
    }
  }

  /**
   * create article
   * @param {*} req
   * @param {*} response
   */
  async createArticle (req, response) {
    try {
      const userId = req.sessionuser.id
      const articleId = await ArticleModel.create(req.body, userId)
      DynamicsModel.add({ userId, type: '1', articleId })
      JsonResult.success({
        req,
        response,
        message: '发布文章成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '发布文章失败' })
    }
  }

  /**
   * update article
   * @param {*} req
   * @param {*} response
   */
  async updateArticle (req, response) {
    try {
      const id = req.body.id
      const articleInfo = await ArticleModel.exists({ id })
      if (articleInfo.userId !== req.sessionuser.id) {
        return JsonResult.httpStatus(req, response, 403, {
          message: 'No permission to edit article',
          code: '9999'
        })
      }
      await ArticleModel.update(req.body, id)
      JsonResult.success({
        req,
        response,
        message: '更新文章成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '更新文章失败' })
    }
  }

  /**
   * delete article
   * @param {*} req
   * @param {*} response
   * @returns
   */
  async deleteArticle (req, response) {
    try {
      const id = req.query.id
      const articleInfo = await ArticleModel.exists({ id })
      if (!articleInfo) {
        JsonResult.fail({ req, response, message: '文章不存在' })
      }
      if (articleInfo.userId !== req.sessionuser.id) {
        return JsonResult.httpStatus(req, response, 403, {
          message: 'No permission to delete article',
          code: '9999'
        })
      }
      await ArticleModel.delete(id)
      await UserCollectArticleModel.delete({ articleId: id })
      DynamicsModel.delete({ articleId: id })
      JsonResult.success({
        req,
        response,
        message: '删除文章成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '删除文章失败' })
    }
  }

  /**
   * get articles by collect
   * @param {*} req
   * @param {*} response
   */
  async getArticleByCollect (req, response) {
    try {
      const { userId } = req.query
      const sessionId = await getSessionuserId(req)
      const data = await ArticleModel.findUserCollectArticle(userId, sessionId)
      JsonResult.success({
        req,
        response,
        data,
        message: '查询收藏文章成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '查询收藏文章失败' })
    }
  }

  /**
   * get articles bu agree
   * @param {*} req
   * @param {*} response
   */
  async getArticleByAgree (req, response) {
    try {
      const { userId } = req.query
      const sessionId = await getSessionuserId(req)
      const data = await ArticleModel.findUserAgreeArticle(userId, sessionId)
      JsonResult.success({
        req,
        response,
        data,
        message: '查询点赞文章成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '查询点赞文章失败' })
    }
  }
}

module.exports = new ArticleController()
