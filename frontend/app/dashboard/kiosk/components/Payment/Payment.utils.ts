import { OrderedMenuSetsState, OrderedProductsState } from "@/types/kiosk"
import { addDecimal } from "@/utils/decimal"

export const orderedProductsToPaymentItemAdapter = (orderedProducts: OrderedProductsState) => {
  return orderedProducts && Object.entries(orderedProducts).map(([key, op]) => ({
    name: op.name,
    amount: op.amount,
    price: op.price,
  }))
}

export const orderedMenuSetsToPaymentItemAdapter = (orderedMenuSets: OrderedMenuSetsState) => {
  return orderedMenuSets && Object.entries(orderedMenuSets).map(([key, menuSet]) => ({
    name: menuSet.products.map(p => p.name).join(", "),
    amount: menuSet.amount,
    price: menuSet.products.map(p => p.price).reduce((acc, curr) => {
      return addDecimal(acc, curr)
    }, 0).toFixed(2),
  }))
}
