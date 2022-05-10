const db = require('@/db/db-connection')
const { multipleColumnSet, newRandomId, dateFormat } = require('@/utils/common.util')

class ShareCircleModel {
  constructor () {
    this.tableName = 'share_circle'
  }

  /**
   * find share_circle page list
   * @param {*} param
   * @returns
   */
  async find (param, sessionId) {
    try {
      const { pageNo = 1, pageSize = 20, ...object } = param

      const { columnSet, values } = multipleColumnSet(object)

      let sql = `SELECT ${this.tableName}.*, avatar, nickname, job,
      
        (SELECT COUNT(*) FROM user_agree_sharecircle AS uas WHERE uas.circleId = ${this.tableName}.id) AS agreeCount,

        (SELECT COUNT(*) FROM sharecircle_comment AS sc WHERE sc.circleId = ${this.tableName}.id) AS commentCount,

        (SELECT uas.userId FROM user_agree_sharecircle AS uas WHERE uas.circleId = ${this.tableName}.id AND uas.userId = ?) AS isLiker
      
        FROM ${this.tableName} LEFT JOIN user ON user.id = ${this.tableName}.userId`

      if (!columnSet) {
        const totalSql = `SELECT COUNT(*) as total FROM ${this.tableName}`

        sql += ` ORDER BY createTime DESC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`

        const [list, total] = [await db.query(sql, [sessionId]), await db.query(totalSql)]

        return {
          list: list.map(o => {
            return {
              ...o,

              picList: o.picList.split(';').filter(Boolean),

              isLiker: Boolean(o.isLiker)
            }
          }),

          total: total[0].total,

          pageNo: Number(pageNo)
        }
      } else {
        const totalSql = `SELECT COUNT(*) as total FROM ${this.tableName} WHERE ${columnSet}`

        sql += ` WHERE ${columnSet} ORDER BY createTime DESC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`

        const [list, total] = [await db.query(sql, [sessionId, ...values]), await db.query(totalSql, values)]

        return {
          list: list.map(o => {
            return {
              ...o,

              picList: o.picList.split(';').filter(Boolean),

              isLiker: Boolean(o.isLiker)
            }
          }),

          total: total[0].total,

          pageNo: Number(pageNo)
        }
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * findone sharecircle info
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
   * add share circle
   * @param {*} param0
   */
  async add ({ content, picList, userId }) {
    try {
      const [id, createTime] = [newRandomId(), dateFormat(new Date())]

      const sql = `INSERT INTO ${this.tableName} (id, content, picList, userId, createTime)
      
        VALUES (?, ?, ?, ?, ?)`

      await db.query(sql, [id, content, picList, userId, createTime])
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * get user publish share count
   * @param {*} userId
   * @returns
   */
  async total (userId) {
    try {
      const sql = `SELECT COUNT(*) AS total FROM ${this.tableName} WHERE userId = ?`

      const total = await db.query(sql, [userId])

      return total[0].total
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * delete user sharecircle
   * @param {*} id
   */
  async delete (id) {
    try {
      const sql = `DELETE ${this.tableName}, user_agree_sharecircle, sharecircle_comment
      
      FROM ${this.tableName} LEFT JOIN user_agree_sharecircle ON user_agree_sharecircle.circleId = ${this.tableName}.id

      LEFT JOIN sharecircle_comment ON sharecircle_comment.circleId = ${this.tableName}.id
      
      WHERE ${this.tableName}.id = ?`

      await db.query(sql, [id])
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * find user agree sharecircle list
   * @param {*} userId
   * @param {*} sessionId
   * @returns
   */
  async findUserAgreeCircle (userId, sessionId) {
    try {
      const sql = `SELECT ${this.tableName}.*, user.avatar, user.job, user.nickname,

      (SELECT COUNT(*) FROM user_agree_sharecircle AS uas WHERE uas.circleId = ${this.tableName}.id) AS agreeCount,

      (SELECT COUNT(*) FROM sharecircle_comment AS sc WHERE sc.circleId = ${this.tableName}.id) AS commentCount,
      
      (SELECT uas.userId FROM user_agree_sharecircle AS uas WHERE uas.circleId = ${this.tableName}.id AND uas.userId = ?) AS isLiker
      
      FROM ${this.tableName} LEFT JOIN user ON user.id = ${this.tableName}.userId

      WHERE ${this.tableName}.id in (SELECT uas.circleId FROM user_agree_sharecircle AS uas WHERE uas.userId = ?)`

      const list = await db.query(sql, [sessionId, userId])

      return list.map(o => {
        return {
          ...o,

          picList: o.picList.split(';').filter(Boolean),

          isLiker: Boolean(o.isLiker)
        }
      })
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = new ShareCircleModel()
