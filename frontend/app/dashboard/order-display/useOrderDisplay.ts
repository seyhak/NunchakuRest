"use client"
import { patchFinalizeOrder } from "@/fetchers/menu"
import { useSnackbar } from "@/providers/snackbar-provider"
import { OrderInOrdersDisplay } from "@/types/menu"
import { useCustomSWR } from "@/utils/use-swr"
import { UUID } from "crypto"
import { useCallback, useState } from "react"

export const useOrderDisplay = () => {
  const { refreshData, data, isLoading, error } = useCustomSWR<OrderInOrdersDisplay[]>("/api/orders/")
  const [isControlDialogOpen, setControlDialogOpen] = useState(false)
  const [holdedOrderId, setHoldedOrderId] = useState<null | UUID>(null)
  const {showMessage} = useSnackbar()

  const onButtonClick = useCallback((id: UUID) => {
    setHoldedOrderId(id)
    setControlDialogOpen(true)
  }, [setControlDialogOpen])

  const handleCompleteOrder = useCallback(async () => {
    try {
      await patchFinalizeOrder(holdedOrderId!)
      setControlDialogOpen(false)
      await refreshData()
    } catch (err) {
      console.error(err)
      showMessage((err as Error).message, "error")
    }
  }, [setControlDialogOpen, showMessage, holdedOrderId, refreshData])

  const handleCloseDialog = useCallback(() => {
    setControlDialogOpen(false)
  }, [])

  return {
    data,
    isLoading,
    onButtonClick,
    isControlDialogOpen,
    handleCloseDialog,
    handleCompleteOrder,
  }
}
