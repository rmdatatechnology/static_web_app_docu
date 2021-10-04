import React from "react"

import "./styles.scss"

const Menu = ({ children }) => {
  return (
    <span className="custom-menu">
      {children}
    </span>
  )
}

export default Menu
