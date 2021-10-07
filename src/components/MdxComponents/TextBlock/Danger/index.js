import React from "react"
import TextBlock from "../index"

const Danger = ({ children, padding , symbol}) => {
  return <TextBlock theme="danger" children={children} padding={padding} symbol="&#x26A0;"/>
}

export default Danger
