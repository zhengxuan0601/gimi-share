const db = require('@/db/db-connection')
const { newRandomId, dateFormat } = require('@/utils/common.util')

class ShareCircleCommentModel {
  constructor () {
    this.tableName = 'sharecircle_comment'
  }

  /**
   * find simple comment limit 5
   * @param {*} circleId
   */
  async findLimit5 (circleId) {
    try {
      const sql = `SELECT ${this.tableName}.*, user.avatar, user.job, user.nickname 
      
        FROM ${this.tableName} LEFT JOIN user ON user.id = ${this.tableName}.userId
        
        WHERE ${this.tableName}.circleId = ? AND IFNULL(topId, '') = '' ORDER BY createTime DESC LIMIT 0, 5`

      const totalSql = `SELECT COUNT(*) AS total FROM ${this.tableName} WHERE ${this.tableName}.circleId = ?`

      const [list, total] = [await db.query(sql, [circleId]), await db.query(totalSql, [circleId])]

      return {
        list,
        total: total[0].total
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * add sharecircle comment
   * @param {*} param0
   */
  async add ({ circleId, content, replyId, replyComment, topId, replyNickname, replyUserId, userId }) {
    try {
      const [id, createTime] = [newRandomId(), dateFormat(new Date())]

      const sql = `INSERT INTO ${this.tableName} (id, circleId, content, replyId, replyComment, topId, replyNickname, replyUserId, userId, createTime)
      
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

      await db.query(sql, [id, circleId, content, replyId, replyComment, topId, replyNickname, replyUserId, userId, createTime])
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = new ShareCircleCommentModel()
