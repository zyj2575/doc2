import React from 'react'
import Page from '../../component/Page'

let Container = React.createClass({

  componentDidMount () {
    $('body').scrollTop(0)
  },

  render () {
    return (
      <Page>
        <h1 style={{textAlign:'center'}}>hello 文档</h1>
      </Page>
    )
  }
})

export default Container
