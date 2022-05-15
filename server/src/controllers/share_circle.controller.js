const MessageModel = require('@/models/message.model')
const JsonResult = require('@/utils/httpResponse.unit')
const httpRequest = require('@/utils/httpRequest.unit')
const DynamicsModel = require('@/models/dynamics.model')
const { getSessionuserId } = require('@/utils/common.util')
const ShareCircleModel = require('@/models/share_circle.model')
const UserAgreeSharecircleModel = require('@/models/user_agree_sharecircle.model')

class ShareCircleController {
  /**
   * find share list page
   * @param {*} req
   * @param {*} response
   */
  async findShareList (req, response) {
    try {
      const sessionId = await getSessionuserId(req)
      const data = await ShareCircleModel.find(req.query, sessionId)
      JsonResult.success({
        req,
        data,
        response,
        message: '查询友圈列表成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '查询友圈列表失败' })
    }
  }

  /**
   * find sharecircle info
   * @param {*} req
   * @param {*} response
   */
  async findShareCircleInfo (req, response) {
    try {
      const circleId = req.query.circleId
      const sessionId = await getSessionuserId(req)
      const data = await ShareCircleModel.findOne({ 'share_circle.id': circleId }, sessionId)
      JsonResult.success({
        req,
        data,
        response,
        message: '查询友圈列表成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '查询失败' })
    }
  }

  /**
   * publish share_cricle
   * @param {*} req
   * @param {*} response
   */
  async publishShare (req, response) {
    try {
      const { content } = req.body
      const fileResponse = await Promise.all(req.files.map(file => {
        const fileNameDate = new Date().getTime()
        return httpRequest.post('zdxblog.cn/upload/uploadFile',
          {
            file: httpRequest.file(`${fileNameDate}${encodeURI(file.originalname)}`, file.path)
          }, true)
      }))
      const picList = fileResponse
        .filter(r => r.code === '0')
        .map(r => r.data)
        .join(';')
      const userId = req.sessionuser.id
      const circleId = await ShareCircleModel.add({ content, picList, userId })
      DynamicsModel.add({ userId, type: '1', circleId })
      JsonResult.success({
        req,
        response,
        message: '发布友圈成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '发布友圈失败' })
    }
  }

  /**
   * delete user sharecircle
   * @param {*} req
   * @param {*} response
   * @returns
   */
  async deleteShareCircle (req, response) {
    try {
      const userId = req.sessionuser.id
      const id = req.query.id
      const circle = await ShareCircleModel.exists({ userId, id })
      if (!circle) {
        return JsonResult.httpStatus(req, response, 401, {
          message: 'Authentication failed!',
          code: '9999'
        })
      }
      await ShareCircleModel.delete(id)
      DynamicsModel.delete({ circleId: id })
      JsonResult.success({
        req,
        response,
        message: '删除成功'
      })
    } catch (error) {
      console.log(error)
      JsonResult.fail({ req, response, error, message: '删除失败' })
    }
  }

  /**
   * user agree sharecircle
   * @param {*} req
   * @param {*} response
   */
  async agreeSharecircle (req, response) {
    try {
      const userId = req.sessionuser.id
      const [circleId, uid] = [req.query.id, req.query.uid]
      const shareCircle = await ShareCircleModel.exists({ id: circleId })
      if (!shareCircle) {
        return JsonResult.fail({ req, response, message: '友圈不存在' })
      }
      const exist = await UserAgreeSharecircleModel.findOne({ userId, circleId })
      if (exist) {
        return JsonResult.fail({ req, response, message: '重复点赞' })
      }
      await UserAgreeSharecircleModel.add(userId, circleId)
      if (shareCircle.userId !== userId) {
        DynamicsModel.add({ userId, type: '2', circleId })
        const [sourceUserId, targetUserId, itemType] = [userId, uid, '1']
        const params = { sourceUserId, targetUserId, circleId, itemType }
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
   * user agree sharecircle
   * @param {*} req
   * @param {*} response
   */
  async unagreeSharecircle (req, response) {
    try {
      const userId = req.sessionuser.id
      const circleId = req.query.id
      const shareCircle = await ShareCircleModel.exists({ id: circleId })
      if (!shareCircle) {
        return JsonResult.fail({ req, response, message: '友圈不存在' })
      }
      const exist = await UserAgreeSharecircleModel.findOne({ userId, circleId })
      if (!exist) {
        return JsonResult.fail({ req, response, message: '还未点赞' })
      }
      await UserAgreeSharecircleModel.delete({ userId, circleId })
      DynamicsModel.delete({ userId, type: '2', circleId })
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
   * find user agree circle list
   * @param {*} req
   * @param {*} response
   */
  async userAgreeCircleList (req, response) {
    try {
      const userId = req.query.userId
      const sessionId = await getSessionuserId(req)
      const data = await ShareCircleModel.findUserAgreeCircle(userId, sessionId)
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

module.exports = new ShareCircleController()
