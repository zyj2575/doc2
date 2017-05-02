exports.type = require('./data-type')

exports.success = function (data) {
  var result
  result = {
    success: true
  }
  if (data) {
    result.data = data
  }
  return result
}

exports.fail = function (codes) {
  return {
    success: false,
    error: {
      code: exports.type(Number, '错误码;' + (codes || '')),
      message: exports.type(String, '错误描述')
    }
  }
}
