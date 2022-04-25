const cryptoJs = require('crypto-js')

/**
 * 查询条件sql拼接
 * @param {*} object
 * @returns
 */
exports.multipleColumnSet = (object, joinstr) => {
  if (typeof object !== 'object') {
    throw new Error('Invalid input')
  }
  const keys = Object.keys(object)
  const values = Object.values(object)
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
  for (let i = 1; i <= 16; i++) {
    const n = Math.floor(Math.random() * 16.0).toString(16)
    randomId += n
  }
  return randomId
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
