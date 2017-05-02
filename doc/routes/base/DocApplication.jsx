import React from 'react'
import {connect} from 'react-redux'
import Immutable from 'immutable'
var actions = require('../../redux/actions')

import allApiList from '../../../api/index.coffee'

class Application extends React.Component {

  componentWillMount () {
    this.props.init()
  }

  render () {
    return this.props.children
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    init: () => {
      dispatch(actions.set('allApiList', Immutable.fromJS(allApiList)))
    }
  }
}

export default connect(null, mapDispatchToProps)(Application)
