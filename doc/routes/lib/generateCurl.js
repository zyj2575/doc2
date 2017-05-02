let _ = require('lodash')
let querystring = require('querystring')
module.exports = function (opts) {
  let {url, method, header, formBody, jsonBody, query} = opts
  let curl = 'curl '
  curl += '-X ' + (method === 'POST' ? 'POST' : 'GET')
  if (header) {
    _.keys(header).map((key) => {
      curl += " -H '" + key + ': ' + header[key] + "'"
    })
  }

  if (formBody) {
    curl += " -d '" + querystring.stringify(formBody) + "'"
  }
  if (jsonBody) {
    curl += ' -d ' + "'" + JSON.stringify(jsonBody) + "'"
  }
  if (url) {
    let indexQuery = url.indexOf('?')
    curl += " '" + url + (query ? (indexQuery > -1 ? (url.substring(indexQuery) === '' ? '' : '&') : '?') : '') +
      querystring.stringify(query) + "'"
  }
  return curl
}
