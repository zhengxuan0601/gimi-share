const captcha = require('svg-captcha')
const { setexAsync } = require('@/redis')
const sendEmail = require('@/utils/email.util')
const HttpUtil = require('@/utils/httpRequest.unit')
const { newRandomId } = require('@/utils/common.util')
const JsonResult = require('@/utils/httpResponse.unit')

class UnitController {
  /**
   * get url link info
   * @param {*} req
   * @param {*} response
   */
  async getLinkInfo (req, response) {
    try {
      const url = req.query.url
      const data = await HttpUtil.get(`juejin.cn/v1/link/info?url=${url}&src=web`)
      JsonResult.success({
        req,
        response,
        data: data.d,
        message: '查询成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '查询失败' })
    }
  }

  /**
   * get captcha
   * @param {*} req
   * @param {*} response
   */
  async getCaptcha (req, response) {
    try {
      const cap = captcha.create({
        size: 4,
        ignoreChars: '0o1il',
        noise: 3,
        width: 120,
        height: 36,
        color: true,
        background: '#fff'
      })
      req.session.captcha = cap.text
      console.log(req.session.captcha)
      JsonResult.success({
        req,
        response,
        data: cap.data,
        message: '获取验证码成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '获取验证码失败' })
    }
  }

  /**
   * get aes key iv
   * @param {*} req
   * @param {*} response
   * @returns
   */
  async getPublicKey (req, response) {
    try {
      const aesKey = newRandomId()
      const aesIv = newRandomId()
      req.session.publicAes = { aesKey, aesIv }
      JsonResult.success({
        req,
        response,
        data: { aesKey, aesIv },
        message: '获取key成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '获取key失败' })
    }
  }

  /**
   * send email code
   * @param {*} req
   * @param {*} response
   */
  async sendEmailCode (req, response) {
    try {
      if (req.session.sendEmailCD) {
        return JsonResult.fail({ req, response, message: '频繁操作，请在一分钟后再次发送！' })
      }
      const email = req.query.email
      const code = String(Math.floor(Math.random() * 3000) + 3000)
      await setexAsync(email, 60 * 30, code)
      req.session.sendEmailCD = true
      await sendEmail(email, code)
      JsonResult.success({
        req,
        response,
        message: '发送验证码成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '发送验证码失败' })
    }
  }
}

module.exports = new UnitController()
