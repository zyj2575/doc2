(function () {
  var DataType

  DataType = (function () {
    function DataType (type, comment) {
      this.type = type
      this.comment = comment
    }

    DataType.prototype.formatComment = function () {
      var comments
      if (!this.comment) {
        return ''
      }
      comments = this.comment.split(/;\s*/).map(function (str) {
        return ' <span class="label label-default">' + str + '</span>'
      })
      return comments.join('')
    }

    return DataType
  })()

  module.exports = function (type, comment) {
    if (arguments.length === 0) {
      return DataType
    }
    return new DataType(type, comment)
  }
}).call(this)
