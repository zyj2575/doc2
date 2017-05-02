'use strict'

var fs = require('fs')
var request = require('request')
var _ = require('lodash')
var bodyParser = require('body-parser')

var proxy = function () {
  return function (req, res) {
    var url = req.path.substring(1)
    var headers = req.headers
    headers['user-agent'] = req.get('api-user-agent')
    headers['cookie'] = req.get('api-cookie')
    delete headers['api-user-agent']
    delete headers['host']
    var opts = {
      followRedirect: false,
      url: url,
      qs: req.query,
      method: req.method,
      headers: _.assign({}, {
        cookie: req.get('cookie')
      }, headers)
    }

    var contentType = req.get('content-type')

    if (contentType) {
      if (contentType.indexOf('application/json') > -1) {
        opts.json = req.body
      }
      if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
        opts.form = req.body
      }
      if (contentType.indexOf('multipart/form-data') > -1) {
        opts.formData = _.mapValues(req.files, file => fs.createReadStream(file.path))
      }
    }

    request(opts).on('error', function (err) {
      console.log('err', err)
      res.json(err)
    }).pipe(res)
  }
}

module.exports = function (app) {
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({extended: true}))
  app.use('/proxy', proxy())
}
