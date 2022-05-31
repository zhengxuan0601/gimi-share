const fs = require('fs')
const https = require('https')

/**
 * 标识上传文件的类
 * @param filename 文件名
 * @param filepath 文件路径
 * @constructor
 */
function File (filename, filepath) {
  this.filename = filename
  this.filepath = filepath
  this._buffer = null
}

/**
 * 获取文件的Buffer流
 */
File.prototype.getBuffer = function () {
  if (!this._buffer) {
    this._buffer = fs.readFileSync(this.filepath)
  }
  return this._buffer
}

/**
 * http封装的访问工具类
 * @constructor
 */
function HttpUtil () {
  this.boundary = this._generateBoundary()
}

// 'apia.yikeapi.com/olympic/?appid=43656176&appsecret=I42og6Lm'
HttpUtil.prototype.get = function (url) {
  const urlArray = url.split('/')
  const host = urlArray[0]
  urlArray[0] = ''
  const path = urlArray.join('/')
  const options = {
    host,
    port: '443',
    method: 'GET',
    path
  }
  console.log(options)
  return new Promise((resolve, reject) => {
    https.request(options, res => {
      if (res.statusCode === 200) {
        let result = ''
        res.on('data', function (data) {
          result += data
        }).on('end', function () {
          resolve(JSON.parse(result))
        })
      } else {
        reject(res)
      }
    }).on('error', function (e) {
      reject(e)
    }).end()
  })
}

/**
 * 模拟post请求数据，可以用于上传文件
 * @param url 接口url
 * @param data 访问的数据json对象，如果有上传的文件请调用模块中的file方法
 * @param formdata 是否上传文件true,false,如果不上传文件请填写false
 */
HttpUtil.prototype.post = function (url, data, formdata) {
  return new Promise((resolve, reject) => {
    const urlArray = url.split('/')
    const host = urlArray[0]
    urlArray[0] = ''
    const path = urlArray.join('/')
    const options = {
      method: 'POST',
      host,
      port: 443,
      path,
      headers: {
        'Content-Type': formdata
          ? 'multipart/form-data; boundary=' + this.boundary
          : 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }
    const req = https.request(options, res => {
      if (res.statusCode === 200) {
        res.setEncoding('utf8')
        let result = ''
        res.on('data', function (data) {
          result += data
        }).on('end', function () {
          resolve(JSON.parse(result))
        })
      } else {
        reject(res)
      }
    })
    req.on('error', function (error) {
      reject(error)
    })
    if (formdata) {
      for (const key in data) {
        if (data[key] instanceof File) {
          req.write(this._structureFileContent(key, data[key]))
          req.write(data[key].getBuffer())
        } else {
          req.write(this._structureBasicContent(key, data[key]))
        }
      }
      req.write('\r\n--' + this.boundary + '--\r\n')
    } else {
      req.write(JSON.stringify(data || {}))
    }
    req.end()
  })
}

/**
 * 构建基本http请求参数
 * @param name 名字
 * @param value 值
 * @param content 要拼接的字符串
 * @private
 */
HttpUtil.prototype._structureBasicContent = function (name, value) {
  const content =
    '--' +
    this.boundary +
    '\r\n' +
    'Content-Disposition: form-data; name="' +
    name +
    '"' +
    '\r\n\r\n' +
    value +
    '\r\n'
  return content
}

/**
 * 构建http上传文件的请求参数
 * @param file File对象
 * @param content 要拼接的content
 * @private
 */
HttpUtil.prototype._structureFileContent = function (name, file) {
  if (file instanceof File) {
    const content =
      '--' +
      this.boundary +
      '\r\n' +
      'Content-Disposition: form-data; name="' +
      name +
      '"; filename="' +
      encodeURIComponent(file.filename) +
      '"' +
      '\r\n' +
      'Content-Type: application/octet-stream' +
      '\r\n\r\n'
    return content
  }
  throw new Error('请传入File对象!')
}

/**
 *生成Boundary分割符
 * @private
 */
HttpUtil.prototype._generateBoundary = function () {
  return '---------------------------' + Math.random().toString(32)
}

/**
 * 创建上传的File对象
 * @param filename 文件名
 * @param filepath 文件路径
 * @returns {File} File对象
 */
HttpUtil.prototype.file = function (filename, filepath) {
  return new File(filename, filepath)
}

module.exports = new HttpUtil()
