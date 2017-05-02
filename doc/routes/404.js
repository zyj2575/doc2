import React from 'react'

module.exports = {
  path: '*',
  component: function () {
    return (
      <div>
        <h2>Not found</h2>
        <p>The page you requested was not found.</p>
      </div>
    )
  }
}
