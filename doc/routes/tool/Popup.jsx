import React from 'react'
import styles from './Popup.scss'
import {connect} from 'react-redux'
var Modal = require('react-bootstrap/lib/Modal')

let Popup = React.createClass({

  render () {
    let {title, content, closeCallBack, children} = this.props
    return (
      <Modal
        show
        onHide={closeCallBack}
        bsSize={'lg'}
        aria-labelledby='contained-modal-title'
      >
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title'>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.content}>
          {content}
          {children}
        </Modal.Body>
      </Modal>
    )
  }
})

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {}
}
export default connect(mapStateToProps, mapDispatchToProps)(Popup)

Popup.propTypes = {
  title: React.PropTypes.string,
  content: React.PropTypes.string,
  closeCallBack: React.PropTypes.func
}

