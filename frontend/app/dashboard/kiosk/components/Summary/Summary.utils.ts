import { OrderedMenuSetsState, OrderedProductsState } from "@/types/kiosk"
import { OrderedProduct } from "@/types/menu"
import { addDecimal } from "@/utils/decimal"

export const orderedProductsToSummaryAdapter = (orderedProducts: OrderedProductsState, handleRemove: (key: OrderedProduct) => void) => {
  return orderedProducts && Object.entries(orderedProducts).map(([key, op]) => ({
    name: op.name,
    amount: op.amount,
    price: op.price,
    handleRemove: () => handleRemove(op)
  }))
}

export const orderedMenuSetsToSummaryAdapter = (orderedMenuSets: OrderedMenuSetsState, handleRemove: (key: string) => void) => {
  return orderedMenuSets && Object.entries(orderedMenuSets).map(([key, menuSet]) => ({
    name: menuSet.products.map(p => p.name).join(", "),
    amount: menuSet.amount,
    price: menuSet.products.map(p => p.price).reduce((acc, curr) => {
      return addDecimal(acc, curr)
    }, 0).toFixed(2),
    handleRemove: () => handleRemove(key)
  }))
}
