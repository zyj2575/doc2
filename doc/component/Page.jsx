import React from 'react'
import Head from './Header'
import {connect} from 'react-redux'

import Footer from './Footer'
import style from './Page.scss'

let Doc = React.createClass({

  render () {
    let {children} = this.props

    return (
      <div className={style.this}>
        <Head />
        <div style={{margin: '0 30px 0 30px'}} className='clearfix'>
          {children}
        </div>
        <Footer />
      </div>
    )
  }
})

const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps)(Doc)
