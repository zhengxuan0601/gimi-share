const mysql = require('mysql')
const chalk = require('chalk')
const config = require('config')
const trash = require('@/utils/ini.unit')

class DBConnection {
  constructor () {
    this.db = mysql.createConnection({
      ...config.get('mysql'),
      password: trash.sqlpassword
    })
    this.checkConnection()
  }

  checkConnection () {
    this.db.connect(function (err) {
      if (err) {
        console.log(chalk.red('connect mysql fail!'))
      } else {
        console.log(chalk.green('connect mysql success!'))
      }
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
