const nodemailer = require('nodemailer')
const trash = require('@/utils/ini.unit')
/**
 * 邮箱发送验证码
 * @param { String } to
 * @param { String } code
 */
async function sendEmail (to, code) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.163.com',
    port: 465,
    secure: true,
    auth: {
      user: 'zx1071401902@163.com',
      pass: trash.emailauth
    }
  })

  try {
    await transporter.sendMail({
      from: 'GimiShare<zx1071401902@163.com>',
      to,
      subject: '【GimiShare】验证码',
      html: `<div style="margin: 100px auto 0;width: 400px; border-bottom: 1px solid #f1f1f1;padding-bottom: 10px;">
      <p style="font-size: 14px; color: #4c4c4c">您好！</p>
      <p style="font-size: 14px; color: #4c4c4c">欢迎使用 <span style="color: #000; font-weight: bold;">GimiShare</span>，你的验证码是：</p>
      <p style="font-size: 24px; color: rgb(72,168,56); font-weight: bold; margin: 0;">${code}</p>
      <p style="font-size: 14px; color: #4c4c4c">有效期 30 分钟，请勿告知他人，以防个人信息泄漏。</p>
      <p style="font-size: 14px; color: #4c4c4c; margin-top: 60px;">谢谢！😊</p>
    </div>`
    })
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = sendEmail
