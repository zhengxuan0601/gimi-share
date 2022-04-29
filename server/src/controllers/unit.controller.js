const captcha = require('svg-captcha')
const { newRandomId } = require('@/utils/common.util')
const JsonResult = require('@/utils/httpResponse.unit')

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
      return JsonResult.success({
        req,
        response,
        data: { aesKey, aesIv },
        message: '获取key成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '获取key失败' })
    }
  }
}

module.exports = new UnitController()
