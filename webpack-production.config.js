module.exports = [
  require('./make-webpack-config')({
    longTermCaching: true,
    minimize: true,
    buildPath: 'build/prod'
  })
]
