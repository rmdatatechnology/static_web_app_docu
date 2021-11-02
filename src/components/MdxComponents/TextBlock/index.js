import React from "react"
import styled from "styled-components"
import PropTypes from "prop-types"
import "../../../styles/styles.scss";

const TextBlock = ({ theme, children , symbol }) => {
 
  return (
    <div className={theme}>
	<span>{symbol}</span>
      {children}
    </div>
  )
}

export default TextBlock

// Check props
TextBlock.propTypes = {
  theme: PropTypes.string.isRequired,
}
