const db = require('@/db/db-connection')
const { multipleColumnSet } = require('@/utils/common.util')
const { newRandomId, dateFormat } = require('@/utils/common.util')

class ShareCircleCommentModel {
  constructor () {
    this.tableName = 'sharecircle_comment'
  }

  /**
   * find one sharecircle comment
   * @param {*} param
   */
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
   * find simple comment limit 5
   * @param {*} circleId
   */
  async findLimit5 (circleId, sessionId) {
    try {
      const sql = `SELECT ${this.tableName}.*, user.avatar, user.job, user.nickname,

        (SELECT COUNT(*) FROM user_agree_comment AS uac WHERE uac.commentId = ${this.tableName}.id AND uac.itemType = '2') AS likeCount,

        (SELECT userId FROM user_agree_comment AS uac WHERE uac.commentId = ${this.tableName}.id AND uac.userId = ?) AS isLiker
      
        FROM ${this.tableName} LEFT JOIN user ON user.id = ${this.tableName}.userId
        
        WHERE ${this.tableName}.circleId = ? AND IFNULL(topId, '') = '' ORDER BY createTime DESC LIMIT 0, 5`

      const totalSql = `SELECT COUNT(*) AS total FROM ${this.tableName} WHERE ${this.tableName}.circleId = ?`

      const [list, total] = [await db.query(sql, [sessionId, circleId]), await db.query(totalSql, [circleId])]

      return {
        list: list.map(o => {
          return {
            ...o,
            isLiker: Boolean(o.isLiker)
          }
        }),

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

  /**
   * delete sharecircle comment
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

module.exports = new ShareCircleCommentModel()
