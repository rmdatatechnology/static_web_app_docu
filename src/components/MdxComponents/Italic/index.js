import React from "react"

import "./styles.scss"

const Italic = ({ children }) => {
  return (
    <span className="custom-italic">
      {children}
    </span>
  )
}

export default Italic
