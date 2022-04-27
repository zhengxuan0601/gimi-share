const db = require('@/db/db-connection')
const UserModel = require('@/models/user.model')
// eslint-disable-next-line no-unused-vars
const UserCollectArticleModel = require('@/models/user_collect_article.model')
// eslint-disable-next-line no-unused-vars
const UserAgreeArticleModel = require('@/models/user_agree_article.model')
const { multipleColumnSet, newRandomId, dateFormat } = require('@/utils/common.util')

class ArticleModel {
  constructor () {
    this.tableName = 'article'
  }

  /**
   * search articles
   * @param {*} param
   */
  async find (param) {
    try {
      const { pageNo = 1, pageSize = 10, ...object } = param

      const { columnSet, values } = multipleColumnSet(object)

      let sql = `SELECT * FROM ${this.tableName}`

      if (!columnSet) {
        const totalSql = `SELECT COUNT(*) as total FROM ${this.tableName}`

        const total = await db.query(totalSql)

        sql += ` LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`

        const list = await db.query(sql)

        const users = await Promise.all(list.map(arc => UserModel.findOne({ id: arc.userId }, true)))

        list.forEach((arc, idx) => {
          arc.author = users[idx]
          arc.content = undefined
        })

        return {
          list,
          total: total[0].total,
          pageNo
        }
      }

      sql += ` WHERE ${columnSet} LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`

      const totalSql = `SELECT COUNT(*) as total FROM ${this.tableName} WHERE ${columnSet}`

      const [list, total] = [await db.query(sql, values), await db.query(totalSql, values)]

      const users = await Promise.all(list.map(arc => UserModel.findOne({ id: arc.userId }, true)))

      list.forEach((arc, idx) => {
        arc.author = users[idx]
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

      const sql = `SELECT * FROM ${this.tableName} WHERE ${columnSet}`

      const result = (await db.query(sql, values))[0]

      if (!result) {
        return null
      }

      const author = await UserModel.findOne({ id: result.userId }, true)

      const isflower = await UserCollectArticleModel.findOne(sessionId, result.id)

      const isliker = await UserAgreeArticleModel.findOne(sessionId, result.id)

      return {
        ...result,
        isflower: Boolean(isflower),
        isliker: Boolean(isliker),
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
        FROM ${this.tableName}, comment, user_collect_article, user_agree_article  
        WHERE ${this.tableName}.id = ? AND comment.articleId = ? AND user_collect_article.articleId = ? AND user_agree_article.articleId = ?`

      await db.query(sql, [id, id, id, id])
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
}

module.exports = new ArticleModel()
