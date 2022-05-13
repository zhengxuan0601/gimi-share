const db = require('@/db/db-connection')
const { multipleColumnSet } = require('@/utils/common.util')
const { newRandomId, dateFormat } = require('@/utils/common.util')

class MessageModel {
  constructor () {
    this.tableName = 'message'
  }

  /**
   * find message list
   * @param {*} param
   * @returns
   */
  async find (param) {
    try {
      const { pageNo, pageSize, ...object } = param

      const { columnSet, values } = multipleColumnSet(object, ' AND ')

      const sql = `SELECT ${this.tableName}.*, 
      
        user.nickname AS sourceNickname, 
        
        article.articleTitle, 
        
        share_circle.content AS circleContent
      
        FROM ${this.tableName} LEFT JOIN user ON user.id = ${this.tableName}.sourceUserId

        LEFT JOIN article ON article.id = ${this.tableName}.articleId

        LEFT JOIN share_circle ON share_circle.id = ${this.tableName}.circleId
        
        WHERE ${columnSet} ORDER BY createTime DESC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`

      const totalSql = `SELECT COUNT(*) AS total FROM ${this.tableName} WHERE ${columnSet}`

      const [list, total] = [await db.query(sql, values), await db.query(totalSql, values)]

      return {
        list,

        total: total[0].total,

        pageNo
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * add message
   * @param {*} param0
   */
  async add ({
    sourceUserId,
    targetUserId,
    articleId,
    circleId,
    commentId,
    comment,
    isReplyComment,
    itemType
  }) {
    try {
      const [id, createTime] = [newRandomId(), dateFormat(new Date())]

      const sql = `INSERT INTO ${this.tableName} (id, sourceUserId, targetUserId, articleId, circleId, commentId, comment, itemType, isReplyComment, createTime)
      
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

      await db.query(sql, [id, sourceUserId, targetUserId, articleId, circleId, commentId, comment, itemType, isReplyComment, createTime])
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = new MessageModel()
