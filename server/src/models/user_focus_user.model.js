const db = require('@/db/db-connection')
const { multipleColumnSet } = require('@/utils/common.util')
const UserModel = require('@/models/user.model')

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

      const users = await Promise.all(data.map(o => UserModel.findOne({ id: o.focusId }, true)))

      return users
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

  /**
   * find foucus count and focused count
   * @param {*} userId
   */
  async findFocusCount (userId) {
    try {
      const focusSql = `SELECT COUNT(*) as total FROM ${this.tableName} WHERE userId = ?`

      const focusedSql = `SELECT COUNT(*) as total FROM ${this.tableName} WHERE FOCUSiD = ?`

      const focusCount = await db.query(focusSql, [userId])

      const focusedCount = await db.query(focusedSql, [userId])
      return {
        focusCount: focusCount[0].total,
        focusedCount: focusedCount[0].total
      }
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = new UserFocusUserModel()
