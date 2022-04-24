/**
 * @typedef CreateArticle
 * @property {string} articleTitle.required -文章标题
 * @property {string} content.required -文章内容
 * @property {string} category.required -文章分类
 * @property {string} tag.required -文章标签
 * @property {string} coverImage -文章封面url
 * @property {string} description -文章描述
 * @property {string} linkUrl -文章来源
 */

/**
 * @typedef UpdateArticle
 * @property {string} id.required -文章标识
 * @property {string} articleTitle.required -文章标题
 * @property {string} content.required -文章内容
 * @property {string} category.required -文章分类
 * @property {string} tag.required -文章标签
 * @property {string} coverImage -文章封面url
 * @property {string} description -文章描述
 * @property {string} linkUrl -文章来源
 */

const express = require('express')
const router = express.Router()
const auth = require('@/middleware/auth.middleware')
const articleController = require('@/controllers/article.controller')
const handlerValidate = require('@/middleware/handlerValidate.middleware')
const { updateArticleShema } = require('@/middleware/validators/articleValidator.middleware')

/**
 * 文章列表分页查询
 * @route GET /articles
 * @group 文章管理
 * @param {string} pageNo.query.required
 * @param {string} pageSize.query.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
router.get('/', articleController.getAllArticles)

/**
 * 文章详情查询
 * @route GET /articles/articleinfo
 * @group 文章管理
 * @param {string} id.query.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 */
router.get('/articleinfo', articleController.getArticleInfo)

/**
 * 创建文章
 * @route POST /articles/createarticle
 * @group 文章管理
 * @param {CreateArticle.model} createArticle.body.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/createarticle', auth(), articleController.createArticle)

/**
 * 更新文章
 * @route POST /articles/updatearticle
 * @group 文章管理
 * @param {UpdateArticle.model} udateArticle.body.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/updatearticle', auth(), updateArticleShema, handlerValidate(articleController.updateArticle))

/**
 * 删除文章
 * @route GET /articles/deletearticle
 * @group 文章管理
 * @param {string} id.query.required
 * @returns {object} 200
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get('/deletearticle', auth(), handlerValidate(articleController.deleteArticle))

module.exports = router
