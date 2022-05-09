const JsonResult = require('@/utils/httpResponse.unit')
const httpRequest = require('@/utils/httpRequest.unit')
const ShareCircleModel = require('@/models/share_circle.model')

class ShareCircleController {
  /**
   * find share list page
   * @param {*} req
   * @param {*} response
   */
  async findShareList (req, response) {
    try {
      const data = await ShareCircleModel.find(req.query)
      JsonResult.success({
        req,
        data,
        response,
        message: '查询友圈列表成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '查询友圈列表失败' })
    }
  }

  /**
   * publish share_cricle
   * @param {*} req
   * @param {*} response
   */
  async publishShare (req, response) {
    try {
      const { content } = req.body
      const fileResponse = await Promise.all(req.files.map(file => {
        const fileNameDate = new Date().getTime()
        return httpRequest.post('zdxblog.cn/upload/uploadFile',
          {
            file: httpRequest.file(`${fileNameDate}${encodeURI(file.originalname)}`, file.path)
          }, true)
      }))
      const picList = fileResponse
        .filter(r => r.code === '0')
        .map(r => r.data)
        .join(';')
      console.log(picList)
      const userId = req.sessionuser.id
      await ShareCircleModel.add({ content, picList, userId })
      JsonResult.success({
        req,
        response,
        message: '发布友圈成功'
      })
    } catch (error) {
      JsonResult.fail({ req, response, error, message: '发布友圈失败' })
    }
  }
}

module.exports = new ShareCircleController()
