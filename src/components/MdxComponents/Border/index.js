import React from "react"

import "../../../styles/styles.scss";

const Border = ({ children }) => {
  return (
    <span className="custom-border">
      {children}
    </span>
  )
}

export default Border
