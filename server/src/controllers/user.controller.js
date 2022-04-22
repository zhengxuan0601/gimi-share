const jwt = require('jsonwebtoken')
const trash = require('@/utils/ini.unit')
const UserModel = require('@/models/user.model')
const { decrypt } = require('@/utils/common.util')
const JsonResult = require('@/utils/httpResponse.unit')

class UserController {
  /**
   * search users page
   * @param {*} req
   * @param {*} response
   */
  async getAllUsers (req, response) {
    try {
      const data = await UserModel.find(req.query)
      data.list = data.list.map(user => {
        return {
          ...user,
          password: undefined
        }
      })
      JsonResult.success({
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
      const data = await UserModel.findOne(req.query)
      const { password, ...nopasswordUser } = data || {}
      JsonResult.success({
        response,
        data: nopasswordUser,
        message: '查询用户信息成功'
      })
    } catch (error) {
      console.log(error)
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
      await UserModel.create(req.body)
      JsonResult.success({
        response,
        message: '用户注册成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '用户注册失败' })
    }
  }

  /**
   * get userInfo by id
   * @param {*} req
   * @param {*} response
   */
  async updateUser (req, response) {
    try {
      await UserModel.update(req.body)
      JsonResult.success({
        response,
        message: '更新成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '更新用户失败' })
    }
  }

  /**
   * user login
   * @param {*} req
   * @param {*} response
   * @returns
   */
  async userLogin (req, response) {
    const { username, password } = req.body
    try {
      const user = await UserModel.findOne({ username })

      if (!user) {
        return JsonResult.fail({ req, response, message: '该用户还未注册' })
      }

      const depassword = decrypt(user.password, trash.aesKey, trash.aesIIv)
      if (depassword !== password) {
        return JsonResult.fail({ req, response, message: '用户名或密码错误' })
      }

      delete user.password
      const accessToken = jwt.sign({
        ...user
      }, trash.jsonSecretkey, { expiresIn: trash.expiresIn })
      JsonResult.success({
        response,
        message: '用户登陆成功',
        data: { ...user, accessToken }
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '用户登陆失败' })
    }
  }
}

module.exports = new UserController()
