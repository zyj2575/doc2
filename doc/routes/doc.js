import DocApplication from './base/DocApplication'

require('./doc.gscss')
require('./base/markdown.gscss')

module.exports = {
  name: 'doc',
  path: '/',
  component: DocApplication,
  indexRoute: require('./home'),
  childRoutes: [
    require('./api'),
    require('./404')
  ]
}
