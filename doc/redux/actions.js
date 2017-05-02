export default {
  set (...keyPath) {
    let value = keyPath.pop()
    return {
      type: 'MAP_SET',
      keyPath,
      value
    }
  },

  delete (...keyPath) {
    return {
      type: 'MAP_DELETE',
      keyPath
    }
  }
}
