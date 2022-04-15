import React from "react"
import TextBlock from "../index"

const Info = ({ children, padding, symbol }) => {
  return <TextBlock theme="info" children={children} padding={padding} symbol="&#9432;" />
}

export default Info
