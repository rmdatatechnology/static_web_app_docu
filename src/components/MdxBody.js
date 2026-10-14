import React, { useMemo } from "react"
import * as runtime from "react/jsx-runtime"
import { useMDXComponents } from "@mdx-js/react"

// MDX v1 rendered components that were not provided as a plain <div>
// (MDXDefaultShortcode); MDX 2 throws instead. The compiled code checks every
// component it uses with `_missingMdxReference("Name", true)`.
const MissingComponent = ({ children }) => <div>{children}</div>
const usedComponents = code =>
  [...code.matchAll(/_missingMdxReference\("([^"]+)", true\)/g)].map(m => m[1])

// Renders MDX that was compiled at build time (see src/utils/compile-mdx.js).
// Components come from the surrounding MDXProvider, like MDXRenderer did in v1.
const MdxBody = ({ code }) => {
  const provided = useMDXComponents()
  const Content = useMemo(
    // eslint-disable-next-line no-new-func
    () => (code ? new Function(code)({ ...runtime, useMDXComponents }).default : null),
    [code]
  )
  const fallbacks = useMemo(() => {
    const missing = {}
    if (code) {
      usedComponents(code).forEach(name => {
        if (!provided[name]) missing[name] = MissingComponent
      })
    }
    return missing
  }, [code, provided])

  return Content ? <Content components={fallbacks} /> : null
}

export default MdxBody
