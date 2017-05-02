module.exports = {
  path: 'api',
  childRoutes: [{
    path: ':cate/:name',
    getComponent (nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('./ApiList'))
      })
    }
  }]
}
