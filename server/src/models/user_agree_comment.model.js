const db = require('@/db/db-connection')
const { multipleColumnSet } = require('@/utils/common.util')

class UserAgreeCommentModel {
  constructor () {
    this.tableName = 'user_agree_comment'
  }

  /**
   * find user_comment agree map list
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
   * find one user_comment agree
   * @param {*} userId
   * @param {*} commentId
   * @returns
   */
  async findOne (userId, commentId) {
    try {
      const sql = `SELECT * FROM ${this.tableName} WHERE userId = ? AND commentId = ?`

      const result = await db.query(sql, [userId, commentId])

      return result[0]
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * get user_comment agree total
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
   * add user_comment agree map
   * @param {*} userId
   * @param {*} commentId
   */
  async add (userId, commentId, itemType) {
    try {
      const sql = `INSERT INTO ${this.tableName} (userId, commentId, itemType) VALUES (?, ?, ?)`

      await db.query(sql, [userId, commentId, itemType])
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
     * delete user_comment agree map
     * @param {*} userId
     * @param {*} commentId
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

module.exports = new UserAgreeCommentModel()
