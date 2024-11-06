import React from "react"
import "../../../styles/styles.scss";

const DownloadLink = ({href,children, ...rest  }) => {

  return (
   <a href={href}><button class="btn"><i class="fa fa-download"></i> Download</button></a>
	
  )
}

export default DownloadLink
