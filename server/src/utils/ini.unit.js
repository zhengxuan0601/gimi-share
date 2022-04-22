const fs = require('fs')
const ini = require('ini')
const path = require('path')

try {
  const str = fs.readFileSync(path.join(__dirname, '../../trash.conf')).toString()
  const config = ini.parse(str).base
  module.exports = config
} catch (error) {
  module.exports = {

  }
}
