import React from 'react'
import {connect} from 'react-redux'
import {Link, browserHistory} from 'react-router'
import {List} from 'immutable'
import {Nav, Navbar, NavDropdown, MenuItem, NavItem} from 'react-bootstrap'

let Container = React.createClass({
  to (href) {
    browserHistory.push(href)
  },

  render () {
    let {cates} = this.props
    cates = List.isList(cates) ? cates.toJS() : []
    return (
      <Navbar className='navbar navbar-default navbar-fixed-top' fluid>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to='/' className='navbar-brand'>demo</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            {
              cates && cates.map((cate, i) =>
                <NavDropdown key={i} title={cate.title} id='basic-nav-dropdown'>
                  {
                    cate.apisList.map((apis, j) =>
                      <MenuItem key={j}
                        onClick={this.to.bind(this, `/api/${cate.name}/${apis.name}`)}>{apis.name}</MenuItem>
                    )
                  }
                </NavDropdown>
              )
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
})

const mapStateToProps = (state) => {
  return {
    cates: state.get('allApiList') || []
  }
}

export default connect(mapStateToProps)(Container)
