import { useKioskContext } from "@/providers/kiosk-provider"
import { useMemo } from "react"
import { orderedMenuSetsToSummaryAdapter, orderedProductsToSummaryAdapter } from "./Summary.utils"
import { OrderedProduct } from "@/types/menu"

export const useSummary = (
  handleProductRemove: (item: OrderedProduct) => void,
  handleMenuSetRemove: (itemKey: string) => void
) => {
  const {orderedMenuSetsState: {orderedMenuSets}, orderedProductsState: {orderedProducts}} = useKioskContext()

  const orderedItems = useMemo(() => {
    const products = orderedProductsToSummaryAdapter(orderedProducts, handleProductRemove) || []
    const menuSets = orderedMenuSetsToSummaryAdapter(orderedMenuSets, handleMenuSetRemove) || []
    return [...products, ...menuSets]
  }, [orderedMenuSets, orderedProducts, handleMenuSetRemove, handleProductRemove])

  const sum = useMemo(() => {
    return orderedItems.reduce((acc, curr) => {
      return acc + parseFloat(curr.price)
  }, 0).toFixed(2)}, [orderedItems])
  return {
    sum,
    orderedItems
  }
}
