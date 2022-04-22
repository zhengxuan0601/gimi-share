const JsonResult = {
  success: ({ response, message = 'success', data = null }) => {
    response.send({
      code: '0',
      data,
      message
    })
  },

  fail: ({ req, response, error, message }) => {
    response.send({
      code: '-1',
      data: null,
      message: message
    })
  },

  httpStatus: (response, status, object) => {
    response.status(status).send(object)
  }
}

module.exports = JsonResult
