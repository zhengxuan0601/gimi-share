const db = require('@/db/db-connection')
const { newRandomId, dateFormat, multipleColumnSet } = require('@/utils/common.util')

class BrowseHistoryModel {
  constructor () {
    this.tableName = 'browse_history'
  }

  /**
   * history is esists
   * @param {*} parmas
   * @returns
   */
  async exists (parmas) {
    try {
      const { columnSet, values } = multipleColumnSet(parmas, ' AND ')

      const sql = `SELECT id FROM ${this.tableName} WHERE ${columnSet}`

      const result = await db.query(sql, values)

      return result[0]
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * add user browse history
   * @param {*} userId
   * @param {*} articleId
   */
  async add ({ userId, uid, articleId }) {
    try {
      const [id, createTime] = [newRandomId(), dateFormat(new Date())]

      const date = createTime.substr(0, 10)

      const sql = `INSERT INTO ${this.tableName} (id, userId, uid, articleId, createTime, date) 
      
        VALUES (?, ?, ?, ?, ?, ?)`

      await db.query(sql, [id, userId, uid, articleId, createTime, date])
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * update history datetime
   * @param {*} param0
   */
  async update ({ userId, articleId }) {
    try {
      const createTime = dateFormat(new Date())

      const date = createTime.substr(0, 10)

      const sql = `UPDATE ${this.tableName} SET createTime = ?, date = ? WHERE userId = ? AND articleId = ?`

      await db.query(sql, [createTime, date, userId, articleId])
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * delete browse history
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

module.exports = new BrowseHistoryModel()
