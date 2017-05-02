import React from 'react'
import {connect} from 'react-redux'
var actions = require('redux/actions')
import style from './Item.scss'
import Immutable from 'immutable'
import {getState} from 'redux/store'
let querystring = require('querystring')

const mapDispatchToProps = (dispatch, props) => {
  let {itemType} = props

  function updateUrl () {
    if (itemType === 'query') {
      let preUrl = getState().getIn(['tool', 'url']) || ''
      if (preUrl.indexOf('?') > -1) {
        preUrl = preUrl.substr(0, preUrl.indexOf('?'))
      }
      let query = getState().getIn(['tool', 'query'])
      query = query ? query.toJS() : []
      let qs = {}
      _.each(query, obj => {
        qs[obj.key] = obj.value
      })
      let tail = '?' + querystring.stringify(qs)
      if (tail === '?=') {
        tail = ''
      }
      let url = preUrl + tail
      dispatch(actions.set('tool', 'url', url))
    }
  }

  return {
    init: () => {
      dispatch(actions.set('tool', itemType, items => (items.size !== 0 ? items : Immutable.fromJS([{
        key: '',
        value: ''
      }]))))
    },
    addItem: (index) => {
      dispatch(actions.set('tool', itemType, items => items.insert(index + 1, Immutable.fromJS({key: '', value: ''}))))
    },
    removeItem: (index) => {
      dispatch(actions.set('tool', itemType, items => (items.size > 1 ? items.delete(index) : items)))
      updateUrl()
    },
    updateValue: (index, key, value) => {
      dispatch(actions.set('tool', itemType, index, key, value))
      updateUrl()
    }
  }
}

const mapStateToProps = (state, props) => {
  let {itemType} = props

  return {
    items: state.getIn(['tool', itemType])
  }
}

let Item = React.createClass({

  componentWillMount () {
    this.props.init()
  },

  renderParams () {
    let {items, updateValue, addItem, removeItem} = this.props
    if (!items) {
      return null
    }
    return (
      items.map((item, i) => {
        return (
          <div className='row' key={i}>
            <div className={`col-xs-5`}>
              <div className='input-group' style={{width: '100%'}}>
                <input type='text' className={`form-control ${style.noBorderInput}`} placeholder='key'
                  value={item.get('key') || ''}
                  onChange={(e) => updateValue(i, 'key', e.target.value)} />
              </div>
            </div>
            <div className={`col-xs-5`}>
              <div className='input-group' style={{width: '100%'}}>
                <input type='text' className={`form-control ${style.noBorderInput}`} placeholder='value'
                  value={item.get('value') || ''}
                  onChange={(e) => updateValue(i, 'value', e.target.value)} />
              </div>
            </div>
            <div className='col-xs-2'>
              <button type='button' className={`btn btn-default ${style.delete}`}
                onClick={() => removeItem(i)}>
                -
              </button>
              <button type='button' className={`btn btn-default ${style.delete}`}
                onClick={() => addItem(i)}>
                +
              </button>
            </div>

          </div>
        )
      })
    )
  },

  render () {
    return (
      <div className={style.this}>
        {this.renderParams()}
      </div>
    )
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Item)

Item.propTypes = {
  itemType: React.PropTypes.string.isRequired
}
