const db = require('@/db/db-connection')
const { multipleColumnSet } = require('@/utils/common.util')

class FeedbackAttitudeModel {
  constructor () {
    this.tableName = 'feedback_attitude'
  }

  /**
   * add feedback attitude
   * @param {*} userId
   * @param {*} feedbackId
   * @param {*} itemType
   */
  async add (userId, feedbackId, itemType) {
    try {
      const sql = `INSERT INTO ${this.tableName} (userId, feedbackId, itemType)
      
      VALUES (?, ?, ?)`

      await db.query(sql, [userId, feedbackId, itemType])
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * feedback attitude is exists
   * @param {*} param
   * @returns
   */
  async exists (param) {
    try {
      const { columnSet, values } = multipleColumnSet(param, ' AND ')

      const sql = `SELECT userId FROM ${this.tableName} WHERE ${columnSet}`

      const result = await db.query(sql, values)

      return result[0]
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * delete feedback attitude
   * @param {*} param
   */
  async delete (param) {
    try {
      const { columnSet, values } = multipleColumnSet(param, ' AND ')

      const sql = `DELETE ${this.tableName} WHERE ${columnSet}`

      await db.query(sql, values)
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = new FeedbackAttitudeModel()
