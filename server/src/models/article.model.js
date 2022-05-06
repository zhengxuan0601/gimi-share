const db = require('@/db/db-connection')
const UserModel = require('@/models/user.model')
const UserAgreeArticleModel = require('@/models/user_agree_article.model')
const UserCollectArticleModel = require('@/models/user_collect_article.model')
const { multipleColumnSet, newRandomId, dateFormat } = require('@/utils/common.util')

class ArticleModel {
  constructor () {
    this.tableName = 'article'
  }

  /**
   * search articles
   * @param {*} param
   */
  async find (param, sessionId) {
    try {
      const { pageNo = 1, pageSize = 10, ...object } = param

      const { columnSet, values } = multipleColumnSet(object)

      let sql = `SELECT ${this.tableName}.*, user.nickname, user.avatar,

        (SELECT uac.userId FROM user_agree_article AS uac WHERE uac.articleId = ${this.tableName}.id AND uac.userId = ?) AS isLiker,

        (SELECT COUNT(*) FROM comment AS c WHERE c.articleId = ${this.tableName}.id) AS commentCounts

        FROM ${this.tableName}, user`

      if (!columnSet) {
        const totalSql = `SELECT COUNT(*) as total FROM ${this.tableName}`

        const total = await db.query(totalSql)

        sql += ` WHERE ${this.tableName}.userId = user.id LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`

        const list = await db.query(sql, [sessionId])

        list.forEach(arc => {
          arc.content = undefined

          arc.isLiker = Boolean(arc.isLiker)
        })

        return {
          list,
          total: total[0].total,
          pageNo
        }
      }

      sql += ` WHERE ${columnSet} AND ${this.tableName}.userId = user.id LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`

      const totalSql = `SELECT COUNT(*) as total FROM ${this.tableName} WHERE ${columnSet}`

      const [list, total] = [await db.query(sql, [sessionId, ...values]), await db.query(totalSql, values)]

      list.forEach(arc => {
        arc.content = undefined

        arc.isLiker = Boolean(arc.isLiker)
      })

      return {
        list,

        total: total[0].total,

        pageNo
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * search articleInfo by id
   * @param {*} param
   * @param {*} sessionId
   */
  async findOne (param, sessionId) {
    try {
      const { columnSet, values } = multipleColumnSet(param)

      const sql = `SELECT *, (SELECT COUNT(*) FROM comment as c WHERE c.articleId = ${this.tableName}.id) AS commentCounts FROM ${this.tableName} WHERE ${columnSet}`

      const result = (await db.query(sql, values))[0]

      if (!result) {
        return null
      }

      const author = await UserModel.findOne({ id: result.userId }, true)

      const isFlower = await UserCollectArticleModel.findOne(sessionId, result.id)

      const isLiker = await UserAgreeArticleModel.findOne(sessionId, result.id)

      return {
        ...result,

        isFlower: Boolean(isFlower),

        isLiker: Boolean(isLiker),

        author
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * create article
   * @param {*} param0
   * @param {*} userId
   */
  async create ({ articleTitle, content, category, tag, coverImage, description, linkUrl }, userId) {
    try {
      const id = newRandomId()

      const createTime = dateFormat(new Date())

      const sql = `INSERT INTO ${this.tableName} (userId, id, articleTitle, content, category, tag, coverImage, description, linkUrl, createTime) 

        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

      await db.query(sql, [userId, id, articleTitle, content, category, tag, coverImage, description, linkUrl, createTime])
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * update article
   * @param {*} param0
   * @param {*} id
   */
  async update ({ articleTitle, content, category, tag, coverImage, description, linkUrl }, id) {
    try {
      const updateTime = dateFormat(new Date())

      const { columnSet, values } = multipleColumnSet({

        articleTitle, content, category, tag, coverImage, description, linkUrl, updateTime

      })

      const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE id = ?`

      await db.query(sql, [...values, id])
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * delete article
   * @param {*} id
   */
  async delete (id) {
    try {
      const sql = `DELETE ${this.tableName}, comment, user_collect_article, user_agree_article 

        FROM ${this.tableName} LEFT JOIN comment ON comment.articleId = ${this.tableName}.id

        LEFT JOIN user_collect_article ON user_collect_article.articleId = ${this.tableName}.id

        LEFT JOIN user_agree_article ON user_agree_article.articleId = ${this.tableName}.id

        WHERE ${this.tableName}.id = ?`

      await db.query(sql, [id])
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * auto increment fields
   * @param {*} id
   * @param {*} fields
   */
  async autoIncre (id, fields) {
    try {
      const sql = `UPDATE ${this.tableName} SET ${fields} = ${fields} + 1 WHERE id = ?`

      await db.query(sql, [id])
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * auto decrement fields
   * @param {*} id
   * @param {*} fields
   */
  async autoDec (id, fields) {
    try {
      const sql = `UPDATE ${this.tableName} SET ${fields} = ${fields} - 1 WHERE id = ?`

      await db.query(sql, [id])
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * get user collect articles
   * @param {*} userId
   * @returns
   */
  async findUserCollectArticle (userId, sessionId) {
    try {
      const sql = `SELECT ${this.tableName}.*, user.nickname, user.avatar,

        (SELECT COUNT(*) FROM comment as c WHERE c.articleId = ${this.tableName}.id) AS commentCounts

        FROM ${this.tableName} LEFT JOIN user_collect_article ON user_collect_article.userId = ?

        LEFT JOIN user ON user.id = ${this.tableName}.userId
        
        WHERE ${this.tableName}.id = user_collect_article.articleId`

      const list = await db.query(sql, [userId])

      const isLikers = await Promise.all(list.map(arc => UserAgreeArticleModel.findOne(sessionId, arc.id)))

      list.forEach((arc, idx) => {
        arc.content = undefined

        arc.isLiker = Boolean(isLikers[idx])
      })

      return list
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * get user agree articles
   * @param {*} userId
   * @returns
   */
  async findUserAgreeArticle (userId, sessionId) {
    try {
      const sql = `SELECT ${this.tableName}.*, user.nickname, user.avatar,

        (SELECT COUNT(*) FROM comment as c WHERE c.articleId = ${this.tableName}.id) AS commentCounts
        
        FROM ${this.tableName} LEFT JOIN user_agree_article ON user_agree_article.userId = ?

        LEFT JOIN user ON user.id = ${this.tableName}.userId

        WHERE ${this.tableName}.id = user_agree_article.articleId`

      const list = await db.query(sql, [userId])

      const isLikers = await Promise.all(list.map(arc => UserAgreeArticleModel.findOne(sessionId, arc.id)))

      list.forEach((arc, idx) => {
        arc.content = undefined

        arc.isLiker = Boolean(isLikers[idx])
      })

      return list
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = new ArticleModel()
