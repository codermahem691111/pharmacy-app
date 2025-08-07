import React from 'react'
import { Outlet, Link } from 'react-router-dom'

function Main() {
  return (
    <div>
      <nav>
        <Link to="/"></Link>
        <Link to="/inventory"></Link>
      </nav>
      <Outlet />
    </div>
  )
}

export default Main
