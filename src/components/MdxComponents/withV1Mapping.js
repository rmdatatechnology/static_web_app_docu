import React from "react"
import { HTML_ALIASES } from "../../utils/mdx-plugins"

// Restores the MDX v1 component mapping on top of MDX 2 (see src/utils/mdx-plugins.js):
// - JSX elements renamed by remarkHtmlAliases use the component for the HTML tag
//   (or stay a plain element when there is none, as in v1).
// - `ul.li` / `ol.li` keys become one `li` that looks at the `data-parent` prop.
const withV1Mapping = components => {
  const { "ul.li": ulLi, "ol.li": olLi, ...rest } = components
  const mapped = { ...rest }

  Object.entries(HTML_ALIASES).forEach(([tag, alias]) => {
    mapped[alias] = rest[tag] || tag
  })

  if (ulLi || olLi) {
    const Li = rest.li || "li"
    mapped.li = ({ "data-parent": parent, ...props }) => {
      if (parent === "ul" && ulLi) return ulLi(props)
      if (parent === "ol" && olLi) return olLi(props)
      return <Li {...props} />
    }
  }

  return mapped
}

export default withV1Mapping
