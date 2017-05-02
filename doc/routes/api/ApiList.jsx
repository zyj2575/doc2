import React from 'react'
import {connect} from 'react-redux'
import {browserHistory, Link} from 'react-router'
import {List} from 'immutable'
import actions from '../../redux/actions'
let _ = require('lodash')
let querystring = require('querystring')
let generateCurl = require('../lib/generateCurl')

require('./ApiList.gscss')

var stringifyObj = require('./stringify-obj')
import MarkDown from '../../component/MarkDown'
import Page from '../../component/Page'

let Container = React.createClass({

  componentWillMount () {
    this.componentWillUpdate(this.props)
  },

  componentWillUpdate (nextProps) {
    let cate = this.getCategory(nextProps)
    let detail = cate && this.getDetail(cate, nextProps)

    if (!detail) {
      browserHistory.push('/')
    } else {
      this.apiInfo = {cate, detail}
    }
  },

  componentDidMount () {
    this.componentDidUpdate()
  },

  componentDidUpdate (preProps) {
    if (!preProps || (preProps.location.hash !== this.props.location.hash)) {
      let index = this.props.location.hash.substr(1)
      let position = $('#api-' + index).position()
      $('html,body').animate({
        scrollTop: position ? position.top + 10 : 0
      })
    }
  },

  getCategory (props) {
    let {cates} = props
    cates = List.isList(cates) ? cates.toJS() : []
    for (let i in cates) {
      let cate = cates[i]
      cate.index = parseInt(i)
      if (cate.name === props.params.cate) {
        return cate
      }
    }
    return null
  },

  getDetail (cate, props) {
    for (let i in cate.apisList) {
      let detail = cate.apisList[i]
      if (detail.name === props.params.name) {
        if (detail.baseUrlOpt) {
          detail.baseUrlOpt = Object.assign({}, cate.baseUrlOpt, detail.baseUrlOpt)
          detail.env = detail.env || 'test'
          detail.baseUrl = detail.baseUrlOpt[detail.env] + detail.baseUrlOpt.path
        }
        detail.index = parseInt(i)
        return detail
      }
    }
    return null
  },

  scrollTo (index) {
    let newHash = index || '#top'
    if (location.hash === newHash) {
      location.hash = ''
    }
    location.hash = newHash
  },

  changeBaseUrl (cate, detail, event) {
    let baseUrl = event.target.value
    this.props.changeDetailProp(cate.index, detail.index, 'baseUrl', baseUrl)
  },

  changeBaseUrlOpt (cate, detail, key, event) {
    let value = event.target.value
    this.props.changeBaseUrlOpt(cate.index, detail.index, key, value)
  },

  setEnv (cate, detail, env) {
    this.props.changeDetailProp(cate.index, detail.index, 'env', env)
  },

  renderJson (prop) {
    return (
      <pre dangerouslySetInnerHTML={{__html: stringifyObj(prop, {indent: '  '})}}/>
    )
  },

  renderArray (prop) {
    return (
      <div>
        {(prop || []).map((item, i) => {
          return (
            <div key={i}>
              {item.name} -> <a href={item.url} target='_blank'>{item.url}</a>
            </div>
          )
        })}
      </div>
    )
  },

  getCurl (api) {
    let {detail} = this.apiInfo
    let objToCurlType = function (query) {
      let typeMap = {
        'String': '测试',
        'Number': 1,
        'Boolean': true,
        'Array': 'test'
      }
      let item = {}
      _.forEach(query, (value, key) => {
        if (value.type) {
          if (value.type.name === 'Object') {
            item[key] = objToCurlType(value)
          }
          if (_.isArray(value.type)) {
            item[key + '[]'] = typeMap['Array']
          } else {
            item[key] = typeMap[value.type.name]
          }
        } else if (value.name) {
          item[key] = typeMap[value.name]
        } else if (_.isArray(value)) {
          item[key + '[]'] = typeMap['Array']
        } else {
          item[key] = typeMap['String']
        }
      })
      return item
    }
    let header = _.assign({}, api.header, {
      'Content-Type': 'application/json'
    })
    let obj = {
      method: api.method,
      url: detail.baseUrl + api.url + (api.query ? '?' + querystring.stringify(objToCurlType(api.query)) : ''),
      jsonBody: api.body ? objToCurlType(api.body) : undefined,
      header
    }
    return encodeURIComponent(generateCurl(obj))
  },

  render () {
    if (!this.apiInfo) {
      browserHistory.push('/')
      return <div />
    }

    let {cate, detail} = this.apiInfo

    return (
      <Page>
        <h2>{detail.name}</h2>
        <p><span className='label label-primary'>{cate.title}</span></p>

        <MarkDown md={detail.description}/>

        {
          detail.baseUrl && !detail.baseUrlOpt &&
          <div>
            <p>
              <strong>baseUrl:</strong>
            </p>

            <p>
              <input type='text' value={detail.baseUrl} className='form-control'
                     onChange={this.changeBaseUrl.bind(this, cate, detail)}/>
            </p>
          </div>
        }

        {
          detail.baseUrlOpt &&
          <div>
            <p><strong>接口地址:</strong></p>
            <ul>
              <li>
                <form className='form-inline'>
                  测试环境: &nbsp; &nbsp;
                  <input type='text' value={detail.baseUrlOpt.test} className='form-control'
                         style={{width: 500}}
                         onChange={this.changeBaseUrlOpt.bind(this, cate, detail, 'test')}/>
                </form>
              </li>
              <li style={{margin: '10px 0 0'}}>生产环境: &nbsp; &nbsp; <strong>{detail.baseUrlOpt.prod}</strong></li>
            </ul>
          </div>
        }

        <p><strong>API List</strong></p>
        <ul>
          {
            detail.apis.map((api, i) =>
              <li key={i}>
                <a onClick={() => this.scrollTo(i + 1)}>{api.title}</a>
                <code>{(api.method || 'GET').toUpperCase()} {api.url}</code>
              </li>
            )
          }
        </ul>

        {detail.dataFormats && detail.dataFormats.length > 0 && <span>
           <p><strong>数据格式列表</strong></p>
            <ul>
              {
                detail.dataFormats.map((api, i) =>
                  <li key={i}>
                    <a onClick={() => this.scrollTo(detail.apis.length+i+ 1)}>{api.title}</a>
                  </li>
                )
              }
            </ul>
        </span>}


        {
          detail.apis.map((api, i) =>
            <div key={i} className='apiGroup' id={`api-${i + 1}`}>
              <h4 className='api-title'>
                <div className='pull-right' style={{fontSize: 16}}>

                  {
                    detail.docPath &&
                    <span>
                      <a target='_blank'
                         href={''}>
                        <span className='glyphicon glyphicon-pencil'/>编辑</a> &nbsp; &nbsp;
                    </span>
                  }
                  <a href={`/tool?curl=` + this.getCurl(api)} target='_blank'>
                    <span className='glyphicon glyphicon-cog'/>测试
                  </a>&nbsp; &nbsp;
                  <a onClick={() => this.scrollTo()}>
                    <span className='glyphicon glyphicon-arrow-up'/>回到顶部</a>
                </div>
                {api.title}
              </h4>

              {
                api.description &&
                <p>
                  {api.description}
                </p>
              }

              <ul className='prop-list'>
                <li>
                  <p><strong>URL</strong> &nbsp; &nbsp; &nbsp;

                    {
                      detail.baseUrlOpt &&
                      <span>
                        <label className='radio-inline'>
                          <input type='radio' checked={detail.env === 'test'}
                                 onChange={this.setEnv.bind(this, cate, detail, 'test')}/> 测试环境
                        </label>
                        <label className='radio-inline'>
                          <input type='radio' checked={detail.env === 'prod'}
                                 onChange={this.setEnv.bind(this, cate, detail, 'prod')}/> 生产环境
                        </label>
                      </span>
                    }
                  </p>

                  <p><a href={detail.baseUrl + api.url} target='_blank'>{detail.baseUrl + api.url}</a></p>
                </li>
                <li>
                  <p><strong>Method</strong></p>

                  <p>{(api.method || 'GET').toUpperCase()}</p>
                </li>
              </ul>

              <ul className='prop-list'>
                {
                  api.headers &&
                  <li>
                    <p><strong>Headers</strong></p>
                    {this.renderJson(api.headers)}
                  </li>
                }
                {
                  api.query &&
                  <li>
                    <p><strong>Query</strong></p>
                    {this.renderJson(api.query)}
                  </li>
                }
                {
                  api.body &&
                  <li>
                    <p><strong>Body</strong></p>
                    {this.renderJson(api.body)}
                  </li>
                }

                <li>
                  <p><strong>Success Response</strong></p>
                  {this.renderJson(api.successResponse)}
                </li>
                <li>
                  <p><strong>Error Response</strong></p>
                  <Link to='/' target='_blank'>通用错误code见首页</Link>
                  {this.renderJson(api.errorResponse)}
                </li>
                {
                  api.wikiList &&
                  <li>
                    <p><strong>聚合后端的wiki地址</strong></p>
                    <pre>
                      {this.renderArray(api.wikiList)}
                    </pre>
                  </li>
                }
                {
                  api.successExample &&
                  <li>
                    <p><strong>Success response example</strong></p>
                    <pre>{JSON.stringify(api.successExample, null, 2)}</pre>
                  </li>
                }
              </ul>
            </div>
          )
        }
        {detail.dataFormats&&
          detail.dataFormats.map((item, i) => {
            return <div key={i} className='apiGroup' id={`api-${detail.apis.length+i + 1}`}>
              <h4 className='api-title'>
                <div className='pull-right' style={{fontSize: 16}}>
                  <a onClick={() => this.scrollTo()}>
                    <span className='glyphicon glyphicon-arrow-up'/>回到顶部</a>
                </div>
                {item.title}
              </h4>

              <ul className='prop-list'>
                {
                  item.format &&
                  <li>
                    <p><strong>Format</strong></p>
                    {this.renderJson(item.format)}
                  </li>
                }
              </ul>
            </div>
          })
        }

      </Page>
    )
  }
})

const mapStateToProps = (state, props) => {
  return {
    cates: state.get('allApiList') || []
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeDetailProp (cateIndex, detailIndex, key, baseUrl) {
      dispatch(actions.set('allApiList', cateIndex, 'apisList', detailIndex, key, baseUrl))
    },
    changeBaseUrlOpt (cateIndex, detailIndex, key, value) {
      dispatch(actions.set('allApiList', cateIndex, 'apisList', detailIndex, 'baseUrlOpt', key, value))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Container)
