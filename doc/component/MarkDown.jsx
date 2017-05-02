import React from 'react'
var marked = require('marked')

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
})

class MarkDown extends React.Component {
  render () {
    let {md} = this.props
    let val = md ? marked(md) : ''

    return (
      <span dangerouslySetInnerHTML={{__html: val}} />
    )
  }
}

export default MarkDown
