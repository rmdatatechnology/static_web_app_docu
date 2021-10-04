import React from "react"

import "./styles.scss"

const Border = ({ children }) => {
  return (
    <span className="custom-border">
      {children}
    </span>
  )
}

export default Border
