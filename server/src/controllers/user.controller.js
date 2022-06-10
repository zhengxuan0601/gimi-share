const jwt = require('jsonwebtoken')
const trash = require('@/utils/ini.unit')
const UserModel = require('@/models/user.model')
const { getAsync, delAsync } = require('@/redis')
const ArticleModel = require('@/models/article.model')
const MessageModel = require('@/models/message.model')
const JsonResult = require('@/utils/httpResponse.unit')
const DynamicsModel = require('@/models/dynamics.model')
const ShareCircleModel = require('@/models/share_circle.model')
const UserFocusUserModel = require('@/models/user_focus_user.model')
const ArticleCommentModel = require('@/models/article_comment.model')
const UserAgreeArticleModel = require('@/models/user_agree_article.model')
const UserAgreeCommentModel = require('@/models/user_agree_comment.model')
const { decrypt, getSessionuserId, encrypt } = require('@/utils/common.util')
const ShareCircleCommentModel = require('@/models/sharecircle_comment.model')
const UserCollectArticleModel = require('@/models/user_collect_article.model')

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
      const exist = await UserModel.findOne({ email })
      if (exist) {
        return JsonResult.fail({ req, response, message: '邮箱已经被注册' })
      }
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
    const { username, password, code, email, emailLogin } = req.body
    try {
      // 邮箱验证码登录
      if (emailLogin) {
        const user = await UserModel.findOne({ email }, false)
        if (!user) {
          return JsonResult.fail({ req, response, message: '该邮箱还未绑定' })
        }
        const sessionCode = await getAsync(email)
        if (code !== sessionCode) {
          return JsonResult.fail({ req, response, message: '验证码不正确' })
        }
        const accessToken = jwt.sign(user, trash.jsonSecretkey, { expiresIn: trash.expiresIn })
        return JsonResult.success({
          req,
          response,
          message: '用户登录成功',
          data: { ...user, accessToken }
        })
      }
      // 用户名密码登录
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
        message: '用户登录成功',
        data: { ...sessionuser, accessToken }
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '用户登录失败' })
    }
  }

  /**
   * change user password
   * @param {*} req
   * @param {*} response
   */
  async userChangePassword (req, response) {
    try {
      const sessionId = await getSessionuserId(req)
      const { type, newpassword, oldpassword, code, email } = req.body
      const sessionCode = await getAsync(email)
      const { aesKey, aesIv } = req.session.publicAes
      const userdepassword = decrypt(newpassword, aesKey, aesIv)
      // 邮箱验证码修改
      if (type === '0') {
        const user = await UserModel.findOne({ email, id: sessionId })
        if (!user) {
          return JsonResult.fail({ req, response, message: '邮箱不正确' })
        }
        if (sessionCode !== code) {
          return JsonResult.fail({ req, response, message: '邮箱验证码不正确' })
        }
      } else if (type === '1') {
        // 原密码修改
        const enoldpassword = encrypt(decrypt(oldpassword, aesKey, aesIv), trash.aesKey, trash.aesIIv)
        const user = await UserModel.findOne({ id: sessionId, password: enoldpassword })
        if (!user) {
          return JsonResult.fail({ req, response, message: '原密码不正确' })
        }
      } else {
        return JsonResult.fail({ req, response, message: 'type异常，修改密码失败' })
      }
      const password = encrypt(userdepassword, trash.aesKey, trash.aesIIv)
      await UserModel.updatePassword(password, sessionId)
      JsonResult.success({
        req,
        response,
        message: '修改密码成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '修改密码失败' })
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
      const { articleId, uid } = req.query
      const exist = await UserCollectArticleModel.findOne(userId, articleId)
      const article = await ArticleModel.exists({ id: articleId })
      if (!article) {
        return JsonResult.fail({ req, response, message: '文章不存在' })
      }
      if (exist) {
        return JsonResult.fail({ req, response, message: '用户已收藏' })
      }
      await UserCollectArticleModel.add(userId, articleId)
      await ArticleModel.autoIncre(articleId, 'collectCounts')
      if (article.userId !== userId) {
        DynamicsModel.add({ userId, type: '4', articleId })
        const [sourceUserId, targetUserId, itemType] = [userId, uid, '2']
        const params = { sourceUserId, targetUserId, articleId, itemType }
        MessageModel.exists(params).then(exists => {
          if (!exists) {
            MessageModel.add(params)
          }
        })
      }
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
      const article = await ArticleModel.exists({ id: articleId })
      if (!article) {
        return JsonResult.fail({ req, response, message: '文章不存在' })
      }
      if (!exist) {
        return JsonResult.fail({ req, response, message: '还未收藏' })
      }
      await UserCollectArticleModel.delete({ userId, articleId })
      await ArticleModel.autoDec(articleId, 'collectCounts')
      DynamicsModel.delete({ userId, type: '4', articleId })
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
      const { articleId, uid } = req.query
      const exist = await UserAgreeArticleModel.findOne(userId, articleId)
      const article = await ArticleModel.exists({ id: articleId })
      if (!article) {
        return JsonResult.fail({ req, response, message: '文章不存在' })
      }
      if (exist) {
        return JsonResult.fail({ req, response, message: '重复点赞' })
      }
      await UserAgreeArticleModel.add(userId, articleId)
      ArticleModel.autoIncre(articleId, 'likeCounts')
      if (article.userId !== userId) {
        DynamicsModel.add({ userId, type: '2', articleId })
        const [sourceUserId, targetUserId, itemType] = [userId, uid, '1']
        const params = { sourceUserId, targetUserId, articleId, itemType }
        MessageModel.exists(params).then(exists => {
          if (!exists) {
            MessageModel.add(params)
          }
        })
      }
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
      const article = await ArticleModel.exists({ id: articleId })
      if (!article) {
        return JsonResult.fail({ req, response, message: '文章不存在' })
      }
      if (!exist) {
        return JsonResult.fail({ req, response, message: '还未点赞' })
      }
      await UserAgreeArticleModel.delete({ userId, articleId })
      ArticleModel.autoDec(articleId, 'likeCounts')
      DynamicsModel.delete({ userId, type: '2', articleId })
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
      if (userId === focusId) {
        return JsonResult.fail({ req, response, message: '不能关注自己' })
      }
      if (exist) {
        return JsonResult.fail({ req, response, message: '已关注' })
      }
      await UserFocusUserModel.add(userId, focusId)
      DynamicsModel.add({ userId, type: '3', focusUserId: focusId })
      const [sourceUserId, targetUserId, itemType] = [userId, focusId, '3']
      const params = { sourceUserId, targetUserId, itemType }
      MessageModel.exists(params).then(exists => {
        if (!exists) {
          MessageModel.add(params)
        }
      })
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
      DynamicsModel.delete({ userId, type: '3', focusUserId: focusId })
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
   * get user focus users and foucused user
   * @param {*} req
   * @param {*} response
   */
  async findFocusUsers (req, response) {
    try {
      const sessionId = await getSessionuserId(req)
      // 关注的用户列表
      const focusdata = await UserFocusUserModel.find(req.query.userId, sessionId, 'userId')
      // 关注者的用户列表
      const focuseddata = await UserFocusUserModel.find(req.query.userId, sessionId, 'focusId')
      JsonResult.success({
        req,
        response,
        data: { focusdata, focuseddata },
        message: '查询成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '查询失败' })
    }
  }

  /**
   * statistics user counts
   * @param {*} req
   * @param {*} response
   */
  async statisticsCounts (req, response) {
    try {
      const { userId } = req.query
      const focusdata = await UserFocusUserModel.findFocusCount(userId)
      const collectCounts = await UserCollectArticleModel.total({ userId })
      const shareCount = await ShareCircleModel.total(userId)
      JsonResult.success({
        req,
        response,
        data: {
          ...focusdata,
          collectCounts,
          shareCount
        },
        message: '查询成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '查询失败' })
    }
  }

  /**
   * user agree comment
   * @param {*} req
   * @param {*} response
   */
  async agreeComment (req, response) {
    try {
      const userId = req.sessionuser.id
      const { commentId, itemType } = req.query
      let comment = null
      if (itemType === '1') {
        comment = await ArticleCommentModel.findOne({ id: commentId })
      } else if (itemType === '2') {
        comment = await ShareCircleCommentModel.findOne({ id: commentId })
      }
      if (!comment) {
        return JsonResult.fail({ req, response, message: '评论不存在' })
      }
      const exist = await UserAgreeCommentModel.findOne(userId, commentId)
      if (exist) {
        return JsonResult.fail({ req, response, message: '重复点赞' })
      }
      await UserAgreeCommentModel.add(userId, commentId, itemType)
      if (itemType === '1') {
        ArticleCommentModel.autoIncre(commentId, 'likeCounts')
      }
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
     * user agree comment
     * @param {*} req
     * @param {*} response
     */
  async unagreeComment (req, response) {
    try {
      const userId = req.sessionuser.id
      const { commentId, itemType } = req.query
      let comment = null
      if (itemType === '1') {
        comment = await ArticleCommentModel.findOne({ id: commentId })
      } else if (itemType === '2') {
        comment = await ShareCircleCommentModel.findOne({ id: commentId })
      }
      if (!comment) {
        return JsonResult.fail({ req, response, message: '评论不存在' })
      }
      const exist = await UserAgreeCommentModel.findOne(userId, commentId)
      if (!exist) {
        return JsonResult.fail({ req, response, message: '还未点赞' })
      }
      await UserAgreeCommentModel.delete({ userId, commentId })
      if (itemType === '1') {
        ArticleCommentModel.autoDec(commentId, 'likeCounts')
      }
      JsonResult.success({
        req,
        response,
        message: '取消点赞成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '取消点赞失败' })
    }
  }
}

module.exports = new UserController()
