import React from "react"
import Product from "../index"

const InventoryManager = ({ children }) => {
  return <Product currentproduct="inventorymanager" children={children} />
}

export default InventoryManager
