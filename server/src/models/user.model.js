const db = require('@/db/db-connection')
const { multipleColumnSet, newRandomId, dateFormat } = require('@/utils/common.util')

class UserModel {
  constructor () {
    this.tableName = 'user'
  }

  /**
   * search users
   * @param {*} param
   * @returns
   */
  async find (param) {
    try {
      const { pageNo = 1, pageSize = 10, ...object } = param

      const { columnSet, values } = multipleColumnSet(object)

      let sql = `SELECT * FROM ${this.tableName}`

      if (!columnSet) {
        const totalSql = `SELECT COUNT(*) as total FROM ${this.tableName}`

        const list = await db.query(sql)

        const total = await db.query(totalSql)

        sql += ` LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`

        return {
          list,
          total: total[0].total,
          pageNo
        }
      }

      sql += ` WHERE ${columnSet} LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`

      const totalSql = `SELECT COUNT(*) as total FROM ${this.tableName}  WHERE ${columnSet}`

      const list = await db.query(sql, values)

      const total = await db.query(totalSql, values)
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
   * search userInfo by id or username
   * @param {*} param
   * @param {*} hidepassword
   * @returns
   */
  async findOne (param, hidepassword) {
    try {
      const { columnSet, values } = multipleColumnSet(param, ' AND ')

      const sql = `SELECT * FROM ${this.tableName} WHERE ${columnSet}`

      const result = (await db.query(sql, values))[0]

      if (!result) {
        return null
      }

      return {
        ...result,
        password: hidepassword ? undefined : result.password
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * delete user by id
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

  /**
   * create user
   * @param {*} param
   */
  async create ({ username, password }) {
    try {
      const id = newRandomId()

      const createTime = dateFormat(new Date())

      const sql = `INSERT INTO ${this.tableName} (id, username, nickname, password, createTime) VALUES (?, ?, ?, ?, ?)`

      await db.query(sql, [id, username, username, password, createTime])
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * update user
   * @param {*} param0
   * @param {*}
   */
  async update ({ id, username, password, ...object }) {
    const { columnSet, values } = multipleColumnSet({
      ...object,
      updateTime: dateFormat(new Date())
    })
    try {
      const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE id = ?`
      await db.query(sql, [...values, id])
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * update user password
   * @param {*} password
   * @param {*} id
   */
  async updatePassword (password, id) {
    try {
      const sql = `UPDATE ${this.tableName} SET password = ? WHERE id = ?`

      await db.query(sql, [password, id])
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * find user rank by article counts
   * @param {*} pageNo
   * @param {*} pageSize
   * @returns
   */
  async findUserArticleRank (pageNo, pageSize) {
    try {
      const sql = `SELECT t.id, t.nickname, t.avatar, t.job
      
        FROM ${this.tableName} AS t 
        
        ORDER BY (SELECT COUNT(*) FROM article AS a WHERE a.userId = t.id) DESC 
        
        LIMIT ${pageSize * (pageNo - 1)}, ${pageSize}`

      const list = await db.query(sql)

      return list
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * search user by kwywords
   * @param {*} pageNo
   * @param {*} pageSize
   * @param {*} value
   */
  async vagueFind ({ pageNo, pageSize, value }, sessionId) {
    try {
      const sql = `SELECT id, avatar, nickname, job,

        (SELECT COUNT(*) FROM article AS a WHERE a.userId = t.id) AS articleCount,

        (SELECT COUNT(*) FROM user_focus_user AS ufu WHERE ufu.focusId = t.id) AS focusedCount,

        (SELECT COUNT(*) FROM share_circle AS sc WHERE sc.userId = t.id) AS circleCount,

        (SELECT userId FROM user_focus_user AS ufu WHERE ufu.focusId = t.id AND ufu.userId = ?) AS isFocuser
      
        FROM ${this.tableName}
        
        AS t WHERE t.nickname LIKE ?
        
        LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`

      const totalSql = `SELECT COUNT(*) AS total FROM ${this.tableName} AS t WHERE t.nickname LIKE ?`

      const [list, total] = [await db.query(sql, [sessionId, `%${value}%`]), await db.query(totalSql, [`%${value}%`])]

      return {
        list: list.map(u => {
          return {
            ...u,
            isFocuser: Boolean(u.isFocuser)
          }
        }),

        total: total[0].total,

        pageNo: Number(pageNo)
      }
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = new UserModel()
