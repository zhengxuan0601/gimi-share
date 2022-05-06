const captcha = require('svg-captcha')
const { newRandomId } = require('@/utils/common.util')
const JsonResult = require('@/utils/httpResponse.unit')
const UserModel = require('@/models/user.model')
const sendEmail = require('@/utils/email.util')
const { setexAsync, getAsync } = require('@/redis')

class UnitController {
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
      const email = req.query.email
      if (await getAsync(`${email}-expires`)) {
        return JsonResult.fail({ req, response, message: '频繁操作，请在一分钟后再次发送！' })
      }
      const code = String(Math.floor(Math.random() * 1000) + 4000)
      const exist = await UserModel.findOne({ email })
      if (exist) {
        return JsonResult.fail({ req, response, message: '邮箱已经被注册' })
      }
      await setexAsync(email, 60 * 30, code)
      await setexAsync(`${email}-expires`, 60, code)
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
