const db = require('@/db/db-connection')
const { newRandomId, dateFormat, multipleColumnSet } = require('@/utils/common.util')

class FeedbackModel {
  constructor () {
    this.tableName = 'feedback'
  }

  /**
   * find feedback list by page
   * @param {*} param
   * @returns
   */
  async find (param) {
    try {
      const { pageNo, pageSize } = param

      const sql = `SELECT ${this.tableName}.*, user.avatar, user.nickname
      
        FROM ${this.tableName} LEFT JOIN user ON user.id = ${this.tableName}.userId
        
        ORDER BY ${this.tableName}.createTime DESC 
        
        LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`

      const totalSql = `SELECT COUNT(*) AS total FROM ${this.tableName}`

      const [list, total] = [await db.query(sql), await db.query(totalSql)]

      return {
        list,

        pageNo: Number(pageNo),

        total: total[0].total
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * user add feedback
   * @param {*} param0
   */
  async add ({ userId, content }) {
    try {
      const [id, createTime] = [newRandomId(), dateFormat(new Date())]

      const sql = `INSERT INTO ${this.tableName} (id, userId, content, createTime)
      
        VALUES (?, ?, ?, ?)`

      await db.query(sql, [id, userId, content, createTime])
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * feedback is exists
   * @param {*} id
   * @returns
   */
  async exists (param) {
    try {
      const { columnSet, values } = multipleColumnSet(param, ' AND ')

      const sql = `SELECT id FROM ${this.tableName} WHERE ${columnSet}`

      const result = await db.query(sql, values)

      return result[0]
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * delete feedback by id
   * @param {*} id
   */
  async delete (id) {
    try {
      const sql = `DELETE FROM ${this.tableName} WHERE id = ?`

      await db.query(sql, [id])
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = new FeedbackModel()
