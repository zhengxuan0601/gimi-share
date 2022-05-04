const mysql = require('mysql')
const chalk = require('chalk')
const config = require('config')
const trash = require('@/utils/ini.unit')

class DBConnection {
  constructor () {
    this.db = mysql.createPool({
      ...config.get('mysql'),
      password: trash.sqlpassword
    })
    this.checkConnection()
  }

  checkConnection () {
    this.db.getConnection(function (err, connection) {
      if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
          console.log(chalk.red('Database connection was closed.'))
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
          console.log(chalk.red('Database has too many connections.'))
        }
        if (err.code === 'ECONNREFUSED') {
          console.log(chalk.red('Database connection was refused.'))
        }
        console.log(chalk.red('Database connection failed.'))
        return
      }
      if (connection) {
        connection.release()
      }
      console.log(chalk.green('connect mysql success!'))
    })
  }

  query (sql, value) {
    return new Promise((resolve, reject) => {
      this.db.query(sql, value, (error, result) => {
        if (error) {
          return reject(error)
        }
        resolve(result)
      })
    })
  }
}

const db = new DBConnection()
module.exports = db
