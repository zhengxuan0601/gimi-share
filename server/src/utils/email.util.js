const nodemailer = require('nodemailer')
const trash = require('@/utils/ini.unit')
async function sendEmail (to, code) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 587,
    secure: false,
    auth: {
      user: '1071401902@qq.com',
      pass: trash.emailauth
    }
  })

  return new Promise((resolve, reject) => {
    transporter.sendMail({
      from: '需要坚持的人<1071401902@qq.com>',
      to,
      subject: '邮箱绑定验证申请',
      text: code
    }, (error, info) => {
      if (error) {
        reject(error)
      } else {
        transporter.close()
        resolve(info)
      }
    })
  })
}

module.exports = sendEmail
