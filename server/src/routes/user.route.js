const express = require('express')
const router = express.Router()
const auth = require('@/middleware/auth.middleware')
const userController = require('@/controllers/user.controller')
const handlerValidate = require('@/middleware/handlerValidate.middleware')
const { registeruserSchema, loginuserShema } = require('@/middleware/validators/userValidator.middleware')

router.get('/', userController.getAllUsers)
router.get('/userinfo', userController.getUserById)
router.get('/deleteuser', auth(), userController.deleteById)
router.post('/registeruser', registeruserSchema, handlerValidate(userController.createUser))
router.post('/updateuser', auth(), userController.updateUser)
router.post('/login', loginuserShema, handlerValidate(userController.userLogin))

module.exports = router

/** ,
 * @swagger
 * /api/v1/users:
 *    get:
 *      tags:
 *      - 用户管理
 *      summary: 查询用户分页列表
 *      produces:
 *      - application/json
 *      parameters:
 *      - name: pageSize
 *        in: query
 *        description: 每页数据量
 *        required: false
 *        type: integer
 *      - name: pageNo
 *        in: query
 *        description: 指定数据分页
 *        required: false
 *        type: integer
 *      responses:
 *        200:
 *          description: successful operation
 *          schema:
 *            ref: #/definitions/Order
 *        400:
 *          description: Invalid ID supplied
 *        404:
 *          description: Order not found
 * */

/** ,
 * @swagger
 * /api/v1/users/userinfo:
 *    get:
 *      tags:
 *      - 用户管理
 *      summary: 根据用户id查询用户详细信息
 *      produces:
 *      - application/json
 *      parameters:
 *      - name: id
 *        in: query
 *        description: 用户id
 *        required: true
 *        type: string
 *      responses:
 *        200:
 *          description: successful operation
 *          schema:
 *            ref: #/definitions/Order
 *        400:
 *          description: Invalid ID supplied
 *        404:
 *          description: Order not found
 * */

/** ,
 * @swagger
 * /api/v1/users/login:
 *    post:
 *      tags:
 *      - 用户管理
 *      summary: 用户登录
 *      produces:
 *      - application/json
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                                  type: string
 *                                  description: 用户名
 *                          password:
 *                                  type: string
 *                                  description: 密码
 *                  example:
 *                      username: "string"
 *                      password: "string"
 *      responses:
 *        200:
 *          description: successful operation
 *          schema:
 *            ref: #/definitions/Order
 *        400:
 *          description: Invalid ID supplied
 *        404:
 *          description: Order not found
 * */

/** ,
 * @swagger
 * /api/v1/users/updateuser:
 *    post:
 *      tags:
 *      - 用户管理
 *      summary: 用户修改信息
 *      produces:
 *      - application/json
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          id:
 *                                  required: true
 *                                  type: string
 *                                  description: 用户标识
 *                          nickname:
 *                                  type: string
 *                                  description: 昵称
 *                          gender:
 *                                  type: string
 *                                  description: 性别
 *                          avatar:
 *                                  type: string
 *                                  description: 头像地址
 *                          email:
 *                                  type: string
 *                                  description: 邮箱
 *                          age:
 *                                  type: string
 *                                  description: 年龄
 *                          job:
 *                                  type: string
 *                                  description: 职业
 *                          description:
 *                                  type: string
 *                                  description: 简介
 *                  example:
 *                      id: "string"
 *                      nickname: "string"
 *                      gender: "string"
 *                      avatar: "string"
 *                      email: "string"
 *                      age: "string"
 *                      job: "string"
 *                      description: "string"
 *      responses:
 *        200:
 *          description: successful operation
 *          schema:
 *            ref: #/definitions/Order
 *        400:
 *          description: Invalid ID supplied
 *        404:
 *          description: Order not found
 * */
