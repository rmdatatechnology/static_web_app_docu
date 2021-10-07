import React from "react"
import TextBlock from "../index"

const Example = ({ children, padding , symbol}) => {
  return <TextBlock theme="example" children={children} padding={padding} symbol="&#9998;" />
}

export default Example
