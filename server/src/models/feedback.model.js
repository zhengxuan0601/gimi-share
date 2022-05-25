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
  async find (param, sessionId) {
    try {
      const { pageNo, pageSize } = param

      const sql = `SELECT ${this.tableName}.*, user.avatar, user.nickname,

        (SELECT fa.userId FROM feedback_attitude AS fa WHERE fa.feedbackId = ${this.tableName}.id AND fa.userId = '${sessionId}' AND fa.itemType = '1') AS isLiker,

        (SELECT fa.userId FROM feedback_attitude AS fa WHERE fa.feedbackId = ${this.tableName}.id AND fa.userId = '${sessionId}' AND fa.itemType = '2') AS isDisliker,

        (SELECT fa.userId FROM feedback_attitude AS fa WHERE fa.feedbackId = ${this.tableName}.id AND fa.userId = '${sessionId}' AND fa.itemType = '3') AS isGifter,

        (SELECT fa.userId FROM feedback_attitude AS fa WHERE fa.feedbackId = ${this.tableName}.id AND fa.userId = '${sessionId}' AND fa.itemType = '4') AS isHearter,

        (SELECT fa.userId FROM feedback_attitude AS fa WHERE fa.feedbackId = ${this.tableName}.id AND fa.userId = '${sessionId}' AND fa.itemType = '5') AS isRocketer,

        (SELECT fa.userId FROM feedback_attitude AS fa WHERE fa.feedbackId = ${this.tableName}.id AND fa.userId = '${sessionId}' AND fa.itemType = '6') AS isViewer
      
        FROM ${this.tableName} LEFT JOIN user ON user.id = ${this.tableName}.userId
        
        ORDER BY ${this.tableName}.createTime DESC 
        
        LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`

      const totalSql = `SELECT COUNT(*) AS total FROM ${this.tableName}`

      const [list, total] = [await db.query(sql), await db.query(totalSql)]

      return {
        list: list.map(f => {
          return {
            ...f,

            isLiker: Boolean(f.isLiker),

            isDisliker: Boolean(f.isDisliker),

            isGifter: Boolean(f.isGifter),

            isHearter: Boolean(f.isHearter),

            isRocketer: Boolean(f.isRocketer),

            isViewer: Boolean(f.isViewer)
          }
        }),

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
      const sql = `DELETE ${this.tableName}, fa 
      
        FROM ${this.tableName} LEFT JOIN feedback_attitude AS fa ON fa.feedbackId = ${this.tableName}.id
        
        WHERE id = ?`

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
}

module.exports = new FeedbackModel()
