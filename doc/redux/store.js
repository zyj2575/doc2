'use strict'

var {createStore} = require('redux')

module.exports = createStore(require('./reducers/map'))
