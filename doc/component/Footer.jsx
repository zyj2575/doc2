import React from 'react'
import style from './Footer.scss'

let Container = React.createClass({

  render () {
    return (
      <div className={style.this}>
        <hr />
        <div>
          <a target='_blank' href=''>footer</a>
        </div>
      </div>
    )
  }
})

export default Container
