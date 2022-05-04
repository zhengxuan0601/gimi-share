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
      const { columnSet, values } = multipleColumnSet(param)

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
}

module.exports = new UserModel()
