import { message } from 'ant-design-vue'

export default function ({ store, redirect, app: { $axios } }) {
  $axios.onRequest((config) => {
    return config
  })
  
  $axios.onError((error) => {
    const res = error.response || {}
    const mes = res.statusText || '错误的请求'
    // 对响应错误做点什么
    if (process.client) {
      message.error('网络异常，请求失败')
    }
    return Promise.reject(new Error(mes))
  })
  
  $axios.onResponse((response) => {
    // 返回的是文件二进制流  用blob接收  直接返回不做其它处理
    if (response.headers['content-disposition'] && response.headers['content-disposition'].includes('attachment')) {
      return response
    }
    const res = response.data
    if (res.code !== '0') {
      if (process.client) {
        message.error(res.message)
      }
      return Promise.reject(response)
    }
    return Promise.resolve({
      code: res.code,
      message: res.message,
      data: res.data
    })
  })
}