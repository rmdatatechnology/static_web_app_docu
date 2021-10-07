import React from "react"
import TextBlock from "../index"

const Warning = ({ children, padding, symbol }) => {
  return <TextBlock theme="warning" children={children} padding={padding} symbol="&#9888;" />
}

export default Warning
