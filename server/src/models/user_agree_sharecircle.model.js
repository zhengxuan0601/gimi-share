const db = require('@/db/db-connection')
const { multipleColumnSet } = require('@/utils/common.util')

class UserAgreeSharecircleModel {
  constructor () {
    this.tableName = 'user_agree_sharecircle'
  }

  async findOne (param) {
    try {
      const { columnSet, values } = multipleColumnSet(param, ' AND ')

      const sql = `SELECT * FROM ${this.tableName} WHERE ${columnSet}`

      const result = await db.query(sql, values)

      return result[0]
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * add user agree sharecircle
   * @param {*} userId
   * @param {*} circleId
   */
  async add (userId, circleId) {
    try {
      const sql = `INSERT INTO ${this.tableName} (userId, circleId) VALUES (?, ?)`

      await db.query(sql, [userId, circleId])
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * delete user agree sharecircle
   * @param {*} param
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

module.exports = new UserAgreeSharecircleModel()
