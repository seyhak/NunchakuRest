import { PaymentMethods as PaymentMethodsType } from "@/types/menu"
import { KioskPages } from "@/types/kiosk"
import { useState } from "react"
import { createOrderFetcher } from "@/fetchers/menu"
import { useSnackbar } from "@/providers/snackbar-provider"
import { useKioskContext } from "@/providers/kiosk-provider"

export const usePayment = (
) => {
  const [isLoading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const {showMessage} = useSnackbar()
  const {orderedProductsState: {orderedProducts}, orderedMenuSetsState: {orderedMenuSets}, pageState: {setPage}} = useKioskContext()

  const handlePay = async (paymentMethod: PaymentMethodsType) => {
    setLoading(true)
    const products = orderedProducts ? Object.values(orderedProducts).map(p => ({
      amount: p.amount,
      id: p.id
    })) : []

    const menuSets = orderedMenuSets ? Object.values(orderedMenuSets).map(item => {
      return {
        id: item.id,
        amount: item.amount,
        products: item.products.map(p => ({id: p.id}))
      }
    }) : []

    try {
      const order = await createOrderFetcher({
        menuSets,
        products,
        paymentMethod
      })
      setOrderId(order.orderId)
    } catch(err) {
      console.error(err)
      showMessage("Something went wrong 😓", "error")
    }
    setLoading(false)
  }
  const onBackButtonClick = () => {
    setPage(KioskPages.MENU)
  }
  return {
    onBackButtonClick,
    isLoading,
    handlePay,
    orderId
  }
}
