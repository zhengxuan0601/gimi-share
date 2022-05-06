const jwt = require('jsonwebtoken')
const trash = require('@/utils/ini.unit')
const UserModel = require('@/models/user.model')
const { getAsync, delAsync } = require('@/redis')
const ArticleModel = require('@/models/article.model')
const JsonResult = require('@/utils/httpResponse.unit')
const UserFocusUserModel = require('@/models/user_focus_user.model')
const UserAgreeArticleModel = require('@/models/user_agree_article.model')
const UserCollectArticleModel = require('@/models/user_collect_article.model')
const { decrypt, getSessionuserId, encrypt } = require('@/utils/common.util')

class UserController {
  /**
   * search users page
   * @param {*} req
   * @param {*} response
   */
  async getAllUsers (req, response) {
    try {
      const data = await UserModel.find(req.query, true)
      data.list = data.list.map(user => {
        return user
      })
      JsonResult.success({
        req,
        response,
        data,
        message: '查询用户列表成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '查询用户列表失败' })
    }
  }

  /**
   * get userInfo by id
   * @param {*} req
   * @param {*} response
   */
  async getUserById (req, response) {
    try {
      const data = await UserModel.findOne(req.query, true)
      JsonResult.success({
        req,
        response,
        data,
        message: '查询用户信息成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '查询用户信息失败' })
    }
  }

  /**
   * get current login userInfo
   * @param {*} req
   * @param {*} response
   */
  async getSessionUserInfo (req, response) {
    try {
      JsonResult.success({
        req,
        response,
        data: req.sessionuser,
        message: '查询用户信息成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '查询用户信息失败' })
    }
  }

  /**
   * delete user by id
   * @param {*} req
   * @param {*} response
   */
  async deleteById (req, response) {
    try {
      const { id } = req.query
      await UserModel.delete(id)
      JsonResult.success({
        req,
        response,
        message: '删除用户成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '删除用户失败' })
    }
  }

  /**
   * user register
   * @param {*} req
   * @param {*} response
   */
  async createUser (req, response) {
    try {
      const { code } = req.body
      const captcha = req.session.captcha
      if (!captcha || (code.toLowerCase() !== captcha.toLowerCase())) {
        return JsonResult.fail({ req, response, message: '验证码错误' })
      }
      const { aesKey, aesIv } = req.session.publicAes
      const userdepassword = decrypt(req.body.password, aesKey, aesIv)
      await UserModel.create({
        ...req.body,
        password: encrypt(userdepassword, trash.aesKey, trash.aesIIv)
      })
      JsonResult.success({
        req,
        response,
        message: '用户注册成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '用户注册失败' })
    }
  }

  /**
   * update userInfo by id
   * @param {*} req
   * @param {*} response
   */
  async updateUser (req, response) {
    try {
      const { nickname, job, avatar, description, gender } = req.body
      await UserModel.update({
        nickname,
        job,
        avatar,
        description,
        gender,
        id: req.sessionuser.id
      })
      JsonResult.success({
        req,
        response,
        message: '编辑用户资料成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '编辑用户资料失败' })
    }
  }

  /**
   * user bind email
   * @param {*} req
   * @param {*} response
   * @returns
   */
  async bindEmail (req, response) {
    try {
      const id = req.sessionuser.id
      const { email, code } = req.body
      const sessionCode = await getAsync(email)
      if (code !== sessionCode) {
        return JsonResult.fail({ req, response, message: '验证码不正确' })
      }
      await UserModel.update({ email, id })
      delAsync(email)
      JsonResult.success({
        req,
        response,
        message: '绑定邮箱成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '邮箱绑定失败' })
    }
  }

  /**
   * user login
   * @param {*} req
   * @param {*} response
   * @returns
   */
  async userLogin (req, response) {
    const { username, password, code } = req.body
    try {
      const captcha = req.session.captcha
      if (!captcha || (code.toLowerCase() !== captcha.toLowerCase())) {
        return JsonResult.fail({ req, response, message: '验证码错误' })
      }
      const user = await UserModel.findOne({ username }, false)
      if (!user) {
        return JsonResult.fail({ req, response, message: '该用户还未注册' })
      }
      const depassword = decrypt(user.password, trash.aesKey, trash.aesIIv)
      const { aesKey, aesIv } = req.session.publicAes
      const userdepassword = decrypt(password, aesKey, aesIv)
      if (depassword !== userdepassword) {
        return JsonResult.fail({ req, response, message: '用户名或密码错误' })
      }
      const sessionuser = { ...user, password: undefined }
      const accessToken = jwt.sign(sessionuser, trash.jsonSecretkey, { expiresIn: trash.expiresIn })
      JsonResult.success({
        req,
        response,
        message: '用户登陆成功',
        data: { ...sessionuser, accessToken }
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '用户登陆失败' })
    }
  }

  /**
   * user collect article
   * @param {*} req
   * @param {*} response
   */
  async userCollectArticle (req, response) {
    try {
      const userId = req.sessionuser.id
      const articleId = req.query.articleId
      const exist = await UserCollectArticleModel.findOne(userId, articleId)
      const article = await ArticleModel.findOne(articleId)
      if (!article) {
        return JsonResult.fail({ req, response, message: '文章不存在' })
      }
      if (exist) {
        return JsonResult.fail({ req, response, message: '用户已收藏' })
      }
      await UserCollectArticleModel.add(userId, articleId)
      await ArticleModel.autoIncre(articleId, 'collectCounts')
      JsonResult.success({
        req,
        response,
        message: '收藏成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '收藏文章失败' })
    }
  }

  /**
   * user uncollect article
   * @param {*} req
   * @param {*} response
   */
  async userUnCollectArticle (req, response) {
    try {
      const userId = req.sessionuser.id
      const articleId = req.query.articleId
      const exist = await UserCollectArticleModel.findOne(userId, articleId)
      const article = await ArticleModel.findOne(articleId)
      if (!article) {
        return JsonResult.fail({ req, response, message: '文章不存在' })
      }
      if (!exist) {
        return JsonResult.fail({ req, response, message: '还未收藏' })
      }
      await UserCollectArticleModel.delete({ userId, articleId })
      await ArticleModel.autoDec(articleId, 'collectCounts')
      JsonResult.success({
        req,
        response,
        message: '取消收藏成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '取消收藏失败' })
    }
  }

  /**
   * user agree article
   * @param {*} req
   * @param {*} response
   */
  async userAgreeArticle (req, response) {
    try {
      const userId = req.sessionuser.id
      const articleId = req.query.articleId
      const exist = await UserAgreeArticleModel.findOne(userId, articleId)
      const article = await ArticleModel.findOne(articleId)
      if (!article) {
        return JsonResult.fail({ req, response, message: '文章不存在' })
      }
      if (exist) {
        return JsonResult.fail({ req, response, message: '重复点赞' })
      }
      await UserAgreeArticleModel.add(userId, articleId)
      await ArticleModel.autoIncre(articleId, 'likeCounts')
      JsonResult.success({
        req,
        response,
        message: '点赞成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '点赞失败' })
    }
  }

  /**
   * user unagree article
   * @param {*} req
   * @param {*} response
   */
  async userUnAgreeArticle (req, response) {
    try {
      const userId = req.sessionuser.id
      const articleId = req.query.articleId
      const exist = await UserAgreeArticleModel.findOne(userId, articleId)
      const article = await ArticleModel.findOne(articleId)
      if (!article) {
        return JsonResult.fail({ req, response, message: '文章不存在' })
      }
      if (!exist) {
        return JsonResult.fail({ req, response, message: '还未点赞' })
      }
      await UserAgreeArticleModel.delete({ userId, articleId })
      await ArticleModel.autoDec(articleId, 'likeCounts')
      JsonResult.success({
        req,
        response,
        message: '取消点赞成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '取消点赞失败' })
    }
  }

  /**
   * user focus user
   * @param {*} req
   * @param {*} response
   */
  async userFocusUser (req, response) {
    try {
      const userId = req.sessionuser.id
      const focusId = req.query.focusId
      const exist = await UserFocusUserModel.findOne(userId, focusId)
      const user = await UserModel.findOne({ id: focusId }, false)
      if (!user) {
        return JsonResult.fail({ req, response, message: '关注的用户不存在' })
      }
      if (exist) {
        return JsonResult.fail({ req, response, message: '已关注' })
      }
      await UserFocusUserModel.add(userId, focusId)
      JsonResult.success({
        req,
        response,
        message: '关注成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '关注失败' })
    }
  }

  /**
   * user unfocus user
   * @param {*} req
   * @param {*} response
   */
  async userUnFocusUser (req, response) {
    try {
      const userId = req.sessionuser.id
      const focusId = req.query.focusId
      const exist = await UserFocusUserModel.findOne(userId, focusId)
      const user = await UserModel.findOne({ id: focusId }, false)
      if (!user) {
        return JsonResult.fail({ req, response, message: '用户不存在' })
      }
      if (!exist) {
        return JsonResult.fail({ req, response, message: '还未关注' })
      }
      await UserFocusUserModel.delete({ userId, focusId })
      JsonResult.success({
        req,
        response,
        message: '取消关注成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '取消关注失败' })
    }
  }

  /**
   * find user is focus user
   * @param {*} req
   * @param {*} response
   */
  async userIsFocus (req, response) {
    try {
      const { focusId } = req.query
      const userId = await getSessionuserId(req)
      const data = await UserFocusUserModel.findOne(userId, focusId)
      JsonResult.success({
        req,
        response,
        data: Boolean(data),
        message: '查询成功'
      })
    } catch (error) {
      JsonResult.success({
        req,
        response,
        data: false,
        message: '查询成功'
      })
    }
  }

  /**
   * get user focus users
   * @param {*} req
   * @param {*} response
   */
  async findFocusUsers (req, response) {
    try {
      const data = await UserFocusUserModel.find(req.query)
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
   * get user about counts
   * @param {*} req
   * @param {*} response
   */
  async getAllcounts (req, response) {
    try {
      const { userId } = req.query
      const focusdata = await UserFocusUserModel.findFocusCount(userId)
      const collectCounts = await UserCollectArticleModel.total({ userId })
      JsonResult.success({
        req,
        response,
        data: {
          ...focusdata,
          collectCounts
        },
        message: '查询成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '查询失败' })
    }
  }
}

module.exports = new UserController()
