const db = require('@/db/db-connection')
const ArticleModel = require('@/models/article.model')
const ShareCircleModel = require('@/models/share_circle.model')
const UserModel = require('@/models/user.model')
const { newRandomId, dateFormat, multipleColumnSet } = require('@/utils/common.util')

class DynamicsModel {
  constructor () {
    this.tableName = 'dynamics'
  }

  /**
   * find user dynamic list
   * @param {*} userId
   * @param {*} pageNo
   * @param {*} pageSize
   */
  async find (userId, pageNo, pageSize, sessionId) {
    try {
      const sql = `SELECT * FROM ${this.tableName} 
      
      WHERE userId = ? ORDER BY createTime DESC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`

      const totalSql = `SELECT COUNT(*) AS total FROM ${this.tableName} WHERE userId = ?`

      const [list, total] = [await db.query(sql, [userId]), await db.query(totalSql, [userId])]

      const INFOLIST = await Promise.all(list.map(d => {
        return d.articleId

          ? ArticleModel.findOne(d.articleId, sessionId, true)

          : d.circleId

            ? ShareCircleModel.findOne({ 'share_circle.id': d.circleId }, sessionId)

            : UserModel.findOne({ id: d.focusUserId }, true)
      }))

      list.forEach((d, idx) => {
        d.pointInfo = INFOLIST[idx]
      })

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
   * add dynamic
   * @param {*} param0
   */
  async add ({ userId, type, articleId, circleId, focusUserId }) {
    try {
      const [id, createTime] = [newRandomId(), dateFormat(new Date())]

      const sql = `INSERT INTO ${this.tableName} (id, userId, type, articleId, circleId, focusUserId, createTime)
      
        VALUES (?, ?, ?, ?, ?, ?, ?)`

      await db.query(sql, [id, userId, type, articleId, circleId, focusUserId, createTime])
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * delete dynamic
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

module.exports = new DynamicsModel()
