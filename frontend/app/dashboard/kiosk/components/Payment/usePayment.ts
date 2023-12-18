import { KioskPages, PaymentMethods as PaymentMethodsType } from "@/types/menu"
import { useState } from "react"
import { createOrderFetcher } from "@/fetchers/menu"
import { useSnackbar } from "@/providers/snackbar-provider"
import { useKiosk } from "../Kiosk/useKiosk"
import { OrderedProductsState } from "../Menu/useMenu"

export const usePayment = (
  orderedProducts: OrderedProductsState,
  setPage: ReturnType<typeof useKiosk>['pageState']['setPage']
) => {
  const [isLoading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const {showMessage} = useSnackbar()

  const handlePay = async (paymentMethod: PaymentMethodsType) => {
    setLoading(true)
    const products = Object.values(orderedProducts!).map(p => ({
      amount: p.amount,
      id: p.id
    }))
    console.log(createOrderFetcher)

    try {
      const order = await createOrderFetcher({
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
