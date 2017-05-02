'use strict'

import {Map} from 'immutable'

module.exports = function (state = Map({}), action = {}) {
  if (action.type === 'MAP_SET') {
    if (typeof action.value === 'function') {
      return state.updateIn(action.keyPath, action.value)
    } else {
      return state.setIn(action.keyPath, action.value)
    }
  }

  if (action.type === 'MAP_DELETE') {
    return state.deleteIn(action.keyPath)
  }

  return state
}
