const db = require('@/db/db-connection')
const { multipleColumnSet } = require('@/utils/common.util')

class UserFocusUserModel {
  constructor () {
    this.tableName = 'user_focus_user'
  }

  /**
   * find user focus user map list
   * @param {*} param
   * @returns
   */
  async find (param) {
    try {
      const { columnSet, values } = multipleColumnSet(param)

      const sql = `SELECT * FROM ${this.tableName} WHERE ${columnSet}`

      const data = await db.query(sql, values)

      return data
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * findOne user focus user map
   * @param {*} userId
   * @param {*} focusId
   * @returns
   */
  async findOne (userId, focusId) {
    try {
      const sql = `SELECT * FROM ${this.tableName} WHERE userId = ? AND focusId = ?`

      const result = await db.query(sql, [userId, focusId])

      return result[0]
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * add user focus user map
   * @param {*} userId
   * @param {*} focusId
   */
  async add (userId, focusId) {
    try {
      const sql = `INSERT INTO ${this.tableName} (userId, focusId) VALUES (?, ?)`

      await db.query(sql, [userId, focusId])
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * delete user fouce user map
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

module.exports = new UserFocusUserModel()
