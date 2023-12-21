import { useCallback, useState } from "react"


export const useConfirmRemovalDialog = () => {
  const [isRemovalDialogOpened, setRemovalDialogOpened] =
  useState(false)
  const [func, setFunc] = useState<(() => void) | null>(
    null
  )
  const [itemName, setItemName] = useState<string | null>(null)

  const resetState = useCallback(() => {
    setRemovalDialogOpened(false)
    setFunc(null)
    setItemName(null)
  }, [])

  const onConfirmRemoveProduct = useCallback(() => {
    func?.()
    resetState()
  }, [resetState, func])

  const onRemoveProductClose = useCallback(() => {
    resetState()
  }, [resetState])

  const decorateOnClick = useCallback((func: () => void, itemName: string) => {
    setFunc(func)
    setItemName(itemName)
    setRemovalDialogOpened(true)
  }, [])
  return {
    isRemovalDialogOpened,
    onConfirmRemoveProduct,
    onRemoveProductClose,
    decorateOnClick,
    itemName,
  }
}
