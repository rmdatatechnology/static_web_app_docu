import React from "react"
import styled from "styled-components"
import PropTypes from "prop-types"
import "./styles.scss"

const TextBlock = ({ theme, children }) => {
 
  return (
    <div className={theme}>
      {children}
    </div>
  )
}

export default TextBlock

// Check props
TextBlock.propTypes = {
  theme: PropTypes.string.isRequired,
}
