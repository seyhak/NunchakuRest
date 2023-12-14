import { OrderedProduct } from "@/types/menu"
import { useCallback, useState } from "react"

export const useConfirmRemovalDialog = (handleProductClick: (item: OrderedProduct) => void) => {
  const [isRemovalDialogOpened, setRemovalDialogOpened] =
  useState(false)
  const [productToRemove, setProductToRemove] = useState<OrderedProduct | null>(
    null
  )

  const onConfirmRemoveProduct = useCallback(() => {
    handleProductClick(productToRemove!)
    setRemovalDialogOpened(false)
    setProductToRemove(null)
  }, [setRemovalDialogOpened, setProductToRemove, productToRemove, handleProductClick])

  const onRemoveProductClose = useCallback(() => {
    setRemovalDialogOpened(false)
    setProductToRemove(null)
  }, [setRemovalDialogOpened])

  const onOrderedItemClick = useCallback((item: OrderedProduct) => {
    setProductToRemove(item)
    setRemovalDialogOpened(true)
  }, [])
  return {
    isRemovalDialogOpened,
    onConfirmRemoveProduct,
    onRemoveProductClose,
    onOrderedItemClick,
    productToRemove
  }
}
