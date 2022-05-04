import cryptoJs from 'crypto-js'

/**
 * 加密
 * @param { String } data 需要加密的数据
 * @param { String } key 公钥key
 * @param { String } iv
 */
 export const encrypt = (data, key, iv) => {
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
 * 校验所有信息唯一keyid格式
 * @param { String } unipId
 */
export const validateUniqId = uniqId => {
  if (uniqId.length !== 16) {
    return false
  }
  let total = 0
  for (let i = 0; i < uniqId.length - 1; i++) {
    total += isNaN(parseInt(uniqId[i])) ? 6 : parseInt(uniqId[i])
  }
  if (String(total % 9) !== uniqId[uniqId.length - 1]) {
    return false
  }
  return true
}