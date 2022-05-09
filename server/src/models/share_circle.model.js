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
  async find (param) {
    try {
      const { pageNo = 1, pageSize = 20, ...object } = param

      const { columnSet, values } = multipleColumnSet(object)

      let sql = `SELECT ${this.tableName}.*, avatar, nickname, job 
      
        FROM ${this.tableName} LEFT JOIN user ON user.id = ${this.tableName}.userId`

      if (!columnSet) {
        const totalSql = `SELECT COUNT(*) as total FROM ${this.tableName}`

        sql += ` ORDER BY createTime DESC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`

        const [list, total] = [await db.query(sql), await db.query(totalSql)]

        return {
          list: list.map(o => {
            return {
              ...o,
              picList: o.picList.split(';').filter(Boolean)
            }
          }),

          total: total[0].total,

          pageNo: Number(pageNo)
        }
      } else {
        const totalSql = `SELECT COUNT(*) as total FROM ${this.tableName} WHERE ${columnSet}`

        sql += ` WHERE ${columnSet} ORDER BY createTime DESC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`

        const [list, total] = [await db.query(sql, values), await db.query(totalSql, values)]

        return {
          list: list.map(o => {
            return {
              ...o,
              picList: o.picList.split(';').filter(Boolean)
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
}

module.exports = new ShareCircleModel()
