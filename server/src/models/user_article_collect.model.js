const db = require('@/db/db-connection')
const { multipleColumnSet } = require('@/utils/common.util')

class UserArticleCollectModel {
  constructor () {
    this.tableName = 'user_article_collect'
  }

  /**
   * find user_article focus map List
   * @param {*} param
   * @returns
   */
  async find (param) {
    try {
      const { columnSet, values } = multipleColumnSet(param)

      const sql = `SELECT * FROM ${this.tableName} WHERE ${columnSet}`

      const result = await db.query(sql, values)

      return result
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * find one user_article focus
   * @param {*} userId
   * @param {*} articleId
   * @returns
   */
  async findOne (userId, articleId) {
    try {
      const sql = `SELECT * FROM ${this.tableName} WHERE userId = ? AND articleId = ?`

      const result = await db.query(sql, [userId, articleId])

      return result[0]
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }

  /**
   * get user_article focus total
   * @param {*} param
   */
  async total (param) {
    try {
      const { columnSet, values } = multipleColumnSet(param)

      const sql = `SELECT COUNT(*) as total FROM ${this.tableName} WHERE ${columnSet}`

      const total = await db.query(sql, values)

      return total[0].total
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * add user_article fouce map
   * @param {*} userId
   * @param {*} articleId
   */
  async add (userId, articleId) {
    try {
      const sql = `INSERT INTO ${this.tableName} (userId, articleId) VALUES (?, ?)`

      await db.query(sql, [userId, articleId])
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }

  /**
   * delete user_article fouce map
   * @param {*} userId
   * @param {*} articleId
   */
  async delete (param) {
    try {
      const { columnSet, values } = multipleColumnSet(param, ' AND ')

      const sql = `DELETE FROM ${this.tableName} WHERE ${columnSet}`

      await db.query(sql, values)
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = new UserArticleCollectModel()
