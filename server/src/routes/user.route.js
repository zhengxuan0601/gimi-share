/**
 * @typedef LoginInfo
 * @property {string} username.required -用户名
 * @property {string} password.required -密码
 * @property {string} code.required -验证码
 */

/**
 * @typedef UpdateInfo
 * @property {string} nickname -用户昵称
 * @property {enum} gender -用户性别 0 - 男 1 - 女
 * @property {string} email -邮箱
 * @property {string} avatar -头像url
 * @property {string} tel -手机号
 * @property {string} job -职业
 * @property {integer} age -年龄
 * @property {string} description -简介
 */

const express = require('express')
const router = express.Router()
const auth = require('@/middleware/auth.middleware')
const userController = require('@/controllers/user.controller')
const handlerValidate = require('@/middleware/handlerValidate.middleware')
const { registeruserSchema, loginuserShema } = require('@/middleware/validators/userValidator.middleware')

/**
 * 用户列表分页查询
 * @route GET /users
 * @group 用户管理
 * @param {string} pageNo.query.required
 * @param {string} pageSize.query.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
router.get('/', userController.getAllUsers)

/**
 * 根据用户id查询用户详情
 * @route GET /users/userinfo
 * @group 用户管理
 * @param {string} id.query.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
router.get('/userinfo', userController.getUserById)

/**
 * 查询当前登录用户的信息
 * @route GET /users/sessionuserinfo
 * @group 用户管理
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get('/sessionuserinfo', auth(), handlerValidate(userController.getSessionUserInfo))

/**
 * 根据用户id删除用户
 * @route GET /users/deleteuser
 * @group 用户管理
 * @param {string} id.query.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get('/deleteuser', auth(), userController.deleteById)

/**
 * 用户注册
 * @route POST /users/registeruser
 * @group 用户管理
 * @param {LoginInfo.model} loginInfo.body.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
router.post('/registeruser', registeruserSchema, handlerValidate(userController.createUser))

/**
 * 用户信息更新
 * @route POST /users/updateuser
 * @group 用户管理
 * @param {UpdateInfo.model} updateInfo.body.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/updateuser', auth(), handlerValidate(userController.updateUser))

/**
 * 用户登录
 * @route POST /users/login
 * @group 用户管理
 * @param {LoginInfo.model} loginInfo.body.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
router.post('/login', loginuserShema, handlerValidate(userController.userLogin))

/**
 * 用户收藏文章
 * @route GET /users/collectarticle
 * @group 用户管理
 * @param {string} articleId.query.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get('/collectarticle', auth(), handlerValidate(userController.userCollectArticle))

/**
 * 用户取消收藏文章
 * @route GET /users/uncollectarticle
 * @group 用户管理
 * @param {string} articleId.query.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get('/uncollectarticle', auth(), handlerValidate(userController.userUnCollectArticle))

/**
 * 用户点赞文章
 * @route GET /users/agreearticle
 * @group 用户管理
 * @param {string} articleId.query.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get('/agreearticle', auth(), handlerValidate(userController.userAgreeArticle))

/**
  * 用户取消点赞文章
  * @route GET /users/unagreearticle
  * @group 用户管理
  * @param {string} articleId.query.required
  * @returns {object} 200
  * @returns {Error}  default - Unexpected error
  * @security JWT
  */
router.get('/unagreearticle', auth(), handlerValidate(userController.userUnAgreeArticle))

/**
 * 关注用户
 * @route GET /users/focususer
 * @group 用户管理
 * @param {string} focusId.query.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get('/focususer', auth(), handlerValidate(userController.userFocusUser))

/**
   * 取消关注用户
   * @route GET /users/unfocursuse
   * @group 用户管理
   * @param {string} focusId.query.required
   * @returns {object} 200
   * @returns {Error}  default - Unexpected error
   * @security JWT
   */
router.get('/unfocususer', auth(), handlerValidate(userController.userUnFocusUser))

/**
 * 查询登录用户是否关注指定用户
 * @route GET /users/isfocususer
 * @group 用户管理
 * @param {string} focusId.query.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get('/isfocususer', userController.userIsFocus)

module.exports = router
