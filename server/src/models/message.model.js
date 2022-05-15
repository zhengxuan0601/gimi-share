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
      
        user.nickname AS sourceNickname, user.avatar AS sourceAvatar,
        
        article.articleTitle, 
        
        share_circle.content AS circleContent
      
        FROM ${this.tableName} LEFT JOIN user ON user.id = ${this.tableName}.sourceUserId

        LEFT JOIN article ON article.id = ${this.tableName}.articleId

        LEFT JOIN share_circle ON share_circle.id = ${this.tableName}.circleId
        
        WHERE ${columnSet} ORDER BY createTime DESC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`

      const totalSql = `SELECT COUNT(*) AS total FROM ${this.tableName} WHERE ${columnSet}`

      const [list, total] = [await db.query(sql, values), await db.query(totalSql, values)]

      const noRead = list.filter(o => o.haveRead === '0').map(o => o.id)

      noRead.length && this.updateReadState(noRead)

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
   * message is exists
   * @param {*} param
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

  /**
   * batch update message haveRead state
   * @param {*} ids
   */
  async updateReadState (ids) {
    try {
      const sql = `UPDATE ${this.tableName} SET haveRead = '1' WHERE id IN (${ids.map(o => '?').join(',')})`

      await db.query(sql, ids)
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * find message total
   * @param {*} param
   * @returns
   */
  async total (param) {
    try {
      const { columnSet, values } = multipleColumnSet(param, ' AND ')

      const sql = `SELECT COUNT(*) AS total FROM ${this.tableName} WHERE ${columnSet}`

      const data = await db.query(sql, values)

      return data[0].total
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = new MessageModel()
