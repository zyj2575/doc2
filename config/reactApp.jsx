import React from 'react'
import ReactDom from 'react-dom'
import {Provider} from 'react-redux'
import {Router, browserHistory} from 'react-router'
let store = require('../doc/redux/store')
let routes = require('../doc/routes/doc')

ReactDom.render((
  <Provider store={store}>
    <Router history={browserHistory} routes={routes} />
  </Provider>
), document.getElementById('content'))
