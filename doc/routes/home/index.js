module.exports = {
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./HomePage'))
    })
  }
}
