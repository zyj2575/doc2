var $ = require('jquery')
var Promise = require('bluebird')
require('jquery.cookie')
var baseUrl = '/proxy/'

function parseResponse (jqResult) {
  let startTime = new Date().getTime()
  return Promise.resolve(jqResult).then(function (result) {
    return {
      response: jqResult.complete(),
      requestTime: new Date().getTime() - startTime,
      responseResult: result
    }
  }, function (error) {
    throw error.responseJSON
  })
}

function getHeaders (headers) {
  headers['Api-User-Agent'] = headers['User-Agent']
  headers['Api-Cookie'] = headers['Cookie']
  delete headers['User-Agent']
  delete headers['Cookie']
  return headers
}

module.exports = {
  get (url, headers, data) {
    return parseResponse($.ajax(baseUrl + url, {
      dataType: 'json',
      headers: getHeaders(headers),
      data: data,
      timeout: 1000 * 30
    }))
  },

  post (url, headers, data) {
    return parseResponse($.ajax(baseUrl + url, {
      contentType: 'application/json',
      headers: getHeaders(headers),
      dataType: 'json',
      type: 'POST',
      data: JSON.stringify(data),
      timeout: 1000 * 30
    }))
  },

  postForm (url, headers, data) {
    return parseResponse($.ajax(baseUrl + url, {
      headers: getHeaders(headers),
      dataType: 'json',
      type: 'POST',
      data: data,
      timeout: 1000 * 30
    }))
  }
}
