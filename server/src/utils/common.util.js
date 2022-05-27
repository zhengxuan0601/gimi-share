const jwt = require('jsonwebtoken')
const cryptoJs = require('crypto-js')
const trash = require('@/utils/ini.unit')

function removeProperty (obj) {
  Object.keys(obj).forEach(item => {
    if (obj[item] === '' ||
      obj[item] === undefined ||
      obj[item] === null ||
      obj[item] === 'null') delete obj[item]
  })
  return obj
}

/**
 * 查询条件sql拼接
 * @param {*} object
 * @returns
 */
exports.multipleColumnSet = (object, joinstr) => {
  if (typeof object !== 'object') {
    throw new Error('Invalid input')
  }
  const o = removeProperty(object)
  const keys = Object.keys(o)
  const values = Object.values(o)
  const columnSet = keys.map(key => `${key} = ?`).join(joinstr || ', ')

  return {
    columnSet,
    values
  }
}

/**
 * 生成随机字符串
 * @returns { String }
 */
exports.newRandomId = () => {
  let randomId = ''
  for (let i = 1; i <= 15; i++) {
    const n = Math.floor(Math.random() * 16.0).toString(16)
    randomId += n
  }
  let total = 0
  for (let i = 0; i < randomId.length; i++) {
    total += isNaN(parseInt(randomId[i])) ? 6 : parseInt(randomId[i])
  }
  return randomId + String(total % 9)
}

/**
 * 时间格式化
 * @param {*} date
 * @param {*} fmt
 * @returns
 */
exports.dateFormat = (date, fmt = 'YYYY-mm-dd HH:MM:SS') => {
  let ret
  const opt = {
    'Y+': date.getFullYear().toString(),
    'm+': (date.getMonth() + 1).toString(),
    'd+': date.getDate().toString(),
    'H+': date.getHours().toString(),
    'M+': date.getMinutes().toString(),
    'S+': date.getSeconds().toString()
  }
  for (const k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
    }
  }
  return fmt
}

/**
 * 加密
 * @param { String } data 需要加密的数据
 * @param { String } key 公钥key
 * @param { String } iv
 */
exports.encrypt = (data, key, iv) => {
  const okey = cryptoJs.enc.Utf8.parse(key)
  const oiv = cryptoJs.enc.Utf8.parse(iv)
  const srcs = cryptoJs.enc.Utf8.parse(data)
  const encrypted = cryptoJs.AES.encrypt(srcs, okey, {
    iv: oiv,
    mode: cryptoJs.mode.CBC,
    padding: cryptoJs.pad.ZeroPadding
  })
  return encrypted.toString()
}

/**
 * 解密
 * @param { String } data 需要解密的数据
 * @param { String } key 公钥key
 * @param { String } data
 */
exports.decrypt = (data, key, iv) => {
  const okey = cryptoJs.enc.Utf8.parse(key)
  const oiv = cryptoJs.enc.Utf8.parse(iv)
  const decrypted = cryptoJs.AES.decrypt(data, okey, {
    iv: oiv,
    mode: cryptoJs.mode.CBC,
    padding: cryptoJs.pad.ZeroPadding
  })
  return decrypted.toString(cryptoJs.enc.Utf8)
}

/**
 * 获取当前登录用户的userId
 * @param {*} req
 */
exports.getSessionuserId = (req) => {
  return new Promise(resolve => {
    try {
      const headers = req.headers
      if (!headers.accesstoken) {
        resolve(null)
      }
      const decodedToken = jwt.verify(headers.accesstoken, trash.jsonSecretkey)
      resolve(decodedToken.id)
    } catch (error) {
      resolve(null)
    }
  })
}

/**
 * list transform tree
 * @param {*} data
 */
exports.transformTree = (data, key, pkey) => {
  if (!Array.isArray(data)) {
    throw new Error('data is must be array.')
  }
  const clonedata = this.deepClone(data)
  const map = clonedata.reduce((prev, cur) => {
    prev[cur[key]] = cur
    return prev
  }, {})
  const transformdata = []
  for (let i = 0; i < clonedata.length; i++) {
    const parent = map[clonedata[i][pkey]]
    if (!parent) {
      transformdata.push(clonedata[i])
    } else {
      parent.children = [...(parent.children || []), clonedata[i]]
    }
  }
  return transformdata
}

/**
 * deepclone target
 * @param {*} obj
 * @param {*} cache
 * @returns
 */
exports.deepClone = (obj, cache = new WeakMap()) => {
  if (typeof obj !== 'object' || obj === null) return obj
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)
  if (cache.get(obj)) return cache.get(obj)
  const cloneObj = new obj.constructor()
  cache.set(obj, cloneObj)
  for (const k in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) {
      cloneObj[k] = this.deepClone(obj[k], cache)
    }
  }
  return cloneObj
}
