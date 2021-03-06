const db = require('@/db/db-connection')
const { multipleColumnSet, newRandomId, dateFormat } = require('@/utils/common.util')

class ArticleModel {
  constructor () {
    this.tableName = 'article'
  }

  /**
   * search articles
   * @param {*} param
   */
  async find (param, sessionId) {
    try {
      const { pageNo = 1, pageSize = 10, ...object } = param

      const { columnSet, values } = multipleColumnSet(object, ' AND ')

      let sql = `SELECT ${this.tableName}.*, user.nickname, user.avatar,

        (SELECT uaa.userId FROM user_agree_article AS uaa WHERE uaa.articleId = ${this.tableName}.id AND uaa.userId = ?) AS isLiker,

        (SELECT COUNT(*) FROM article_comment AS ac WHERE ac.articleId = ${this.tableName}.id) AS commentCounts

        FROM ${this.tableName}
        
        LEFT JOIN user ON user.id = ${this.tableName}.userId`

      if (!columnSet) {
        const totalSql = `SELECT COUNT(*) as total FROM ${this.tableName}`

        const total = await db.query(totalSql)

        sql += ` ORDER BY createTime DESC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`

        const list = await db.query(sql, [sessionId])

        list.forEach(arc => {
          arc.content = undefined

          arc.isLiker = Boolean(arc.isLiker)
        })

        return {
          list,

          total: total[0].total,

          pageNo: Number(pageNo)
        }
      }

      sql += ` WHERE ${columnSet} ORDER BY createTime DESC LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`

      const totalSql = `SELECT COUNT(*) as total FROM ${this.tableName} WHERE ${columnSet}`

      const [list, total] = [await db.query(sql, [sessionId, ...values]), await db.query(totalSql, values)]

      list.forEach(arc => {
        arc.content = undefined

        arc.isLiker = Boolean(arc.isLiker)
      })

      return {
        list,

        total: total[0].total,

        pageNo: Number(pageNo)
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * search articleInfo by id
   * @param {*} param
   * @param {*} sessionId
   */
  async findOne (articleId, sessionId, hideContent) {
    try {
      const sql = `SELECT ${this.tableName}.*, user.avatar, user.nickname, 
        
        (SELECT COUNT(*) FROM article_comment AS ac WHERE ac.articleId = ${this.tableName}.id) AS commentCounts,
        
        (SELECT uca.userId FROM user_collect_article AS uca WHERE uca.articleId = ${this.tableName}.id AND uca.userId = ? ) AS isFlower,

        (SELECT uaa.userId FROM user_agree_article AS uaa WHERE uaa.articleId = ${this.tableName}.id AND uaa.userId = ? ) AS isLiker
        
        FROM ${this.tableName} LEFT JOIN user ON ${this.tableName}.userId = user.id
        
        WHERE ${this.tableName}.id = ?`

      const result = (await db.query(sql, [sessionId, sessionId, articleId]))[0]

      if (!result) {
        return null
      }

      return {
        ...result,

        content: hideContent ? undefined : result.content,

        isFlower: Boolean(result.isFlower),

        isLiker: Boolean(result.isLiker)
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * @param {*} param
   * @returns
   */
  async exists (param) {
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
   * create article
   * @param {*} param0
   * @param {*} userId
   */
  async create ({ articleTitle, content, category, tag, coverImage, description, linkUrl }, userId) {
    try {
      const id = newRandomId()

      const createTime = dateFormat(new Date())

      const sql = `INSERT INTO ${this.tableName} (userId, id, articleTitle, content, category, tag, coverImage, description, linkUrl, createTime) 

        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

      await db.query(sql, [userId, id, articleTitle, content, category, tag, coverImage, description, linkUrl, createTime])

      return id
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * update article
   * @param {*} param0
   * @param {*} id
   */
  async update ({ articleTitle, content, category, tag, coverImage, description, linkUrl }, id) {
    try {
      const updateTime = dateFormat(new Date())

      const { columnSet, values } = multipleColumnSet({

        articleTitle, content, category, tag, coverImage, description, linkUrl, updateTime

      })

      const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE id = ?`

      await db.query(sql, [...values, id])
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * delete article
   * @param {*} id
   */
  async delete (id) {
    try {
      const sql = `DELETE ${this.tableName}, article_comment, user_collect_article, user_agree_article, user_agree_comment 

        FROM ${this.tableName} LEFT JOIN article_comment ON article_comment.articleId = ${this.tableName}.id

        LEFT JOIN user_collect_article ON user_collect_article.articleId = ${this.tableName}.id

        LEFT JOIN user_agree_article ON user_agree_article.articleId = ${this.tableName}.id

        LEFT JOIN user_agree_comment ON user_agree_comment.commentId = article_comment.id

        WHERE ${this.tableName}.id = ?`

      await db.query(sql, [id])
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

  /**
   * get user collect articles
   * @param {*} userId
   * @returns
   */
  async findUserCollectArticle (userId, sessionId) {
    try {
      const sql = `SELECT ${this.tableName}.*, user.nickname, user.avatar,

        (SELECT COUNT(*) FROM article_comment as ac WHERE ac.articleId = ${this.tableName}.id) AS commentCounts,

        (SELECT uaa.userId FROM user_agree_article AS uaa WHERE uaa.articleId = ${this.tableName}.id AND uaa.userId = ?) AS isLiker

        FROM ${this.tableName} LEFT JOIN user ON user.id = ${this.tableName}.userId
        
        WHERE ${this.tableName}.id in (SELECT uaa.articleId FROM user_collect_article AS uaa WHERE uaa.userId = ?)`

      const list = await db.query(sql, [sessionId, userId])

      list.forEach(arc => {
        arc.content = undefined

        arc.isLiker = Boolean(arc.isLiker)
      })

      return list
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * get user agree articles
   * @param {*} userId
   * @returns
   */
  async findUserAgreeArticle (userId, sessionId) {
    try {
      const sql = `SELECT ${this.tableName}.*, user.nickname, user.avatar,

        (SELECT COUNT(*) FROM article_comment as ac WHERE ac.articleId = ${this.tableName}.id) AS commentCounts,

        (SELECT uaa.userId FROM user_agree_article AS uaa WHERE uaa.articleId = ${this.tableName}.id AND uaa.userId = ?) AS isLiker
        
        FROM ${this.tableName} LEFT JOIN user ON user.id = ${this.tableName}.userId

        WHERE ${this.tableName}.id in (SELECT uaa.articleId FROM user_agree_article AS uaa WHERE uaa.userId = ?)`

      const list = await db.query(sql, [sessionId, userId])

      list.forEach(arc => {
        arc.content = undefined

        arc.isLiker = Boolean(arc.isLiker)
      })

      return list
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * search article by kwywords
   * @param {*} pageNo
   * @param {*} pageSize
   * @param {*} value
   * @returns
   */
  async vagueFind ({ pageNo, pageSize, value }) {
    try {
      const sql = `SELECT arc.id, arc.userId, arc.articleTitle, arc.description, arc.viewCounts, arc.likeCounts, arc.coverImage,
      
      (SELECT user.nickname FROM user WHERE arc.userId = user.id) AS authorNickname,

      (SELECT COUNT(*) FROM article_comment AS ac WHERE arc.id = ac.articleId) AS commentCounts
      
      FROM ${this.tableName} AS arc 
      
      WHERE arc.articleTitle LIKE ? 
      
      OR arc.description LIKE ? LIMIT ${(pageNo - 1) * pageSize}, ${pageSize}`

      const totalSql = `SELECT COUNT(*) AS total FROM ${this.tableName} AS arc
      
      WHERE arc.articleTitle LIKE ? 
      
      OR arc.description LIKE ?`

      const [list, total] = [await db.query(sql, [`%${value}%`, `%${value}%`]), await db.query(totalSql, [`%${value}%`, `%${value}%`])]

      return {
        list,

        total: total[0].total,

        pageNo: Number(pageNo)
      }
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = new ArticleModel()
