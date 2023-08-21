/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { Helmet } from "react-helmet"
import { useLocation } from "@reach/router"
import { useStaticQuery, graphql } from "gatsby"

const Seo = ({ title, description, image }) => {
  const { pathname } = useLocation()
  const { site } = useStaticQuery(query)
  
  const {
    defaultTitle,
    defaultDescription,
    defaultImage,
  } = site.siteMetadata
  
  const originUrl = typeof window !== 'undefined' ? window.location.origin : "";
  
  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: `${originUrl}${image || defaultImage}`,
    url: `${originUrl}${pathname}`,
  }
  
  return (
    <Helmet title={seo.title} titleTemplate={`%s | ${defaultTitle}`}>
      <meta name="description" content={seo.description} />
	   <link rel="apple-touch-icon" sizes="57x57" href="apple-icon-57x57.png" />
	  <link rel="apple-touch-icon" sizes="60x60" href="apple-icon-60x60.png" />
	  <link rel="apple-touch-icon" sizes="72x72" href="apple-icon-72x72.png" />
	  <link rel="apple-touch-icon" sizes="76x76" href="apple-icon-76x76.png" />
	  <link rel="apple-touch-icon" sizes="114x114" href="apple-icon-114x114.png" />
	  <link rel="apple-touch-icon" sizes="120x120" href="apple-icon-120x120.png" />
	  <link rel="apple-touch-icon" sizes="144x144" href="apple-icon-144x144.png" />
	  <link rel="apple-touch-icon" sizes="152x152" href="apple-icon-152x152.png" />
	  <link rel="apple-touch-icon" sizes="180x180" href="apple-icon-180x180.png" />
	  <link rel="icon" type="image/png" sizes="192x192"  href="android-icon-192x192.png" />
	  <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png" />
	  <link rel="icon" type="image/png" sizes="96x96" href="favicon-96x96.png" />
	  <link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png" />
	  <link rel="manifest" href="manifest.json" />
	  <meta name="msapplication-TileColor" content="#ffffff" />
	  <meta name="msapplication-TileImage" content="ms-icon-144x144.png" />
	  <meta name="theme-color" content="#ffffff" />
	  <meta name="robots" content="noindex" />
      {seo.url && <meta property="og:url" content={seo.url} />}
      {seo.title && <meta property="og:title" content={seo.title} />}
      {seo.description && (
        <meta property="og:description" content={seo.description} />
      )}
	 
    </Helmet>
  )
}


export default Seo

const query = graphql`
  query Seo {
    site {
      siteMetadata {
        defaultTitle: title
        defaultDescription: description
        defaultImage: image
      }
    }
  }
`


Seo.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
}
Seo.defaultProps = {
  title: null,
  description: null,
  image: null,
}