const db = require('@/db/db-connection')
const UserAgreeCommentModel = require('@/models/user_agree_comment.model')
const { newRandomId, dateFormat, multipleColumnSet } = require('@/utils/common.util')

class CommentModel {
  constructor () {
    this.tableName = 'comment'
  }

  /**
   * find comments
   * @param {*} param
   * @param {*} sessionId
   */
  async find (param, sessionId) {
    try {
      const { columnSet, values } = multipleColumnSet(param)

      if (!columnSet) {
        const sql = `SELECT ${this.tableName}.*, user.id AS userId, user.avatar, user.nickname, user.job,

          (SELECT COUNT(*) FROM ${this.tableName} AS c WHERE c.replyId = ${this.tableName}.id OR c.topId = ${this.tableName}.id) AS replyCount

          FROM ${this.tableName}, user WHERE IFNULL(articleId, '') = '' AND ${this.tableName}.userId = user.id ORDER BY createTime DESC`

        const result = await db.query(sql)

        const isLikers = await Promise.all(result.map(c => UserAgreeCommentModel.findOne(sessionId, c.id)))

        result.forEach((list, idx) => {
          list.isLiker = Boolean(isLikers[idx])
          list.isAuthor = list.userId === sessionId
        })

        return result
      }

      const sql = `SELECT ${this.tableName}.*, user.id AS userId, user.avatar, user.nickname, user.job,

        (SELECT COUNT(*) FROM ${this.tableName} AS c WHERE c.replyId = ${this.tableName}.id OR c.topId = ${this.tableName}.id) AS replyCount

        FROM ${this.tableName}, user WHERE ${columnSet} AND ${this.tableName}.userId = user.id ORDER BY createTime DESC`

      const result = await db.query(sql, values)

      const isLikers = await Promise.all(result.map(c => UserAgreeCommentModel.findOne(sessionId, c.id)))

      result.forEach((list, idx) => {
        list.isLiker = Boolean(isLikers[idx])
        list.isAuthor = list.userId === sessionId
      })

      return result
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * find one comment
   * @param {*} param
   * @returns
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
   * create comment
   * @param {*} param0
   */
  async create ({ articleId, topId, replyId, replyComment, userId, content, replyNickname, replyUserId }) {
    try {
      const id = newRandomId()

      const createTime = dateFormat(new Date())

      const sql = `INSERT INTO ${this.tableName} 

        (id, articleId, topId, replyId, replyComment, userId, content, replyNickname, replyUserId, createTime) 

        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

      await db.query(sql, [id, articleId, topId, replyId, replyComment, userId, content, replyNickname, replyUserId, createTime])
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * delete comment
   * @param {*} id
   */
  async delete (id) {
    try {
      const sql = `DELETE ${this.tableName}, user_agree_comment 
      
        FROM ${this.tableName} LEFT JOIN user_agree_comment ON user_agree_comment.commentId = ${this.tableName}.id

        WHERE id = ? OR replyId = ? OR topId = ?`

      await db.query(sql, [id, id, id])
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * get comments counts
   * @param {*} param
   * @param {*} connectString
   */
  async total (param, connectString) {
    try {
      const { columnSet, values } = multipleColumnSet(param, connectString)

      const sql = `SELECT COUNT(*) as total FROM ${this.tableName} WHERE ${columnSet}`

      const result = await db.query(sql, values)

      return result[0].total
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

module.exports = new CommentModel()
