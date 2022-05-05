const db = require('@/db/db-connection')
const UserModel = require('@/models/user.model')
const { newRandomId, dateFormat, multipleColumnSet } = require('@/utils/common.util')

class CommentModel {
  constructor () {
    this.tableName = 'comment'
  }

  /**
   * find comments
   * @param {*} param
   */
  async find (param) {
    try {
      const { columnSet, values } = multipleColumnSet(param)

      if (!columnSet) {
        const sql = `SELECT * FROM ${this.tableName} WHERE IFNULL(articleId, '') = '' ORDER BY createTime DESC`

        const result = await db.query(sql)

        const users = await Promise.all(result.map(c => UserModel.findOne({ id: c.userId }, true)))

        result.forEach((c, idx) => {
          c.author = users[idx]
        })

        return result
      }

      const sql = `SELECT * FROM ${this.tableName} WHERE ${columnSet} ORDER BY createTime DESC`

      const result = await db.query(sql, values)

      const users = await Promise.all(result.map(c => UserModel.findOne({ id: c.userId }, true)))

      result.forEach((c, idx) => {
        c.author = users[idx]
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
  async create ({ articleId, topId, replyId, replyComment, userId, content, replyNickname }) {
    try {
      const id = newRandomId()

      const createTime = dateFormat(new Date())

      const sql = `INSERT INTO ${this.tableName} 

        (id, articleId, topId, replyId, replyComment, userId, content, replyNickname, createTime) 

        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`

      await db.query(sql, [id, articleId, topId, replyId, replyComment, userId, content, replyNickname, createTime])
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
      const sql = `DELETE FROM ${this.tableName} WHERE id = ? OR replyId = ?`

      await db.query(sql, [id, id])
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = new CommentModel()
