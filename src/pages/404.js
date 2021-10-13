import React from 'react';
import SEO from '../components/seo';
import "../styles/styles.scss";

const NotFound = () => (
  <>
   <div className="pagecontainer">
		<div className="sidebar" id="sidemenu" />
		<div className="content">
			<SEO title="404: Not found" />
			<h1>404</h1>
		</div>
		<div className="end"></div>
	</div>
  </>
);

export default NotFound;
