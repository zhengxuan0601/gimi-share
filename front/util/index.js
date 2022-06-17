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

/**
 * calculate time
 * @parma { String } date
 */
export const cycleDate = (date) => {
  const dateTimeStamp = new Date(date).getTime()
  const minute = 1000 * 60
  const hour = minute * 60
  const day = hour * 24
  const month = day * 30
  const year = month * 12
  const now = new Date().getTime()
  const diffValue = now - dateTimeStamp
  const yearC = diffValue / year
  const monthC = diffValue / month
  const weekC = diffValue / (7 * day)
  const dayC = diffValue / day
  const hourC = diffValue / hour
  const minC = diffValue / minute
  if (yearC >= 1) {
    return parseInt(yearC) + '年前'
  } else if (monthC >= 1) {
    return parseInt(monthC) + '个月前'
  } else if (weekC >= 1) {
    return parseInt(weekC) + '周前'
  } else if (dayC >= 1) {
    return parseInt(dayC) + '天前'
  } else if (hourC >= 1) {
    return parseInt(hourC) + '小时前'
  } else if (minC >= 1) {
    return parseInt(minC) + '分钟前'
  }
  return '刚刚'
}

/**
 * get base64
 * @param {*} file 
 * @returns 
 */
export const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}