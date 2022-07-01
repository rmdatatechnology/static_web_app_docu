import React from "react"
import PropTypes from "prop-types"
import "../../../styles/styles.scss";

const TextBlock = ({ theme, children , symbol }) => {
 
  let classname = 'customBlockquoteTableColumn ' + theme;
 
  return (
    <div className={theme}>
	<table className="customBlockquoteTable">
	<tr>
	<td className={classname}><span className="customBlockquote">{symbol}</span></td>
	<td className={classname}>{children}</td>
	</tr>
	</table>
    </div>
  )
}

export default TextBlock

// Check props
TextBlock.propTypes = {
  theme: PropTypes.string.isRequired,
}
