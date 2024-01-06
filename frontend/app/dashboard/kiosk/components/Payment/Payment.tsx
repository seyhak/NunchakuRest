import { Button, Divider, Paper, Typography } from "@mui/material"
import "./Payment.sass"
import { PaymentMethods } from "../PaymentMethods/PaymentMethods"

import { Loader } from "@/components/Loader/Loader"
import { PaymentOrderId } from "../PaymentOrderId/PaymentOrderId"
import { usePayment } from "./usePayment"
import { useKioskContext } from "@/providers/kiosk-provider"
import { useMemo } from "react"
import { orderedMenuSetsToPaymentItemAdapter, orderedProductsToPaymentItemAdapter } from "./Payment.utils"


type PaymentProps = {
};
export const Payment = () => {
  const {orderedProductsState: {
    orderedProducts,
  },
  orderedMenuSetsState: {orderedMenuSets}
} = useKioskContext()
const items = useMemo(() => {
  const products = orderedProductsToPaymentItemAdapter(orderedProducts) || []
  const menuSets = orderedMenuSetsToPaymentItemAdapter(orderedMenuSets) || []
  return [...products, ...menuSets]
}, [orderedMenuSets, orderedProducts])

  const {isLoading, handlePay, onBackButtonClick, orderId} = usePayment()

  return (
    <div className="payment">
      <Paper elevation={3}>
        <>
        {!!orderId ? <PaymentOrderId orderId={orderId} /> : isLoading ? <Loader/> : items ? (
          <>
          <div className="products">
            {items.map((op) => (
            <div key={op.name} className="product">
              <Typography>{`${op.name} x ${op.amount}:`}</Typography>
              <Typography>{op.price}</Typography>
              </div>
            ))}
          </div>
          <Divider/>
          <section className="bottom-section">
            <PaymentMethods handlePay={handlePay} />
            <Button onClick={onBackButtonClick} variant="contained" color="secondary">
              Cancel Order
            </Button>
          </section>
          </>
        ) : (
          <Typography>Nothing to show :C</Typography>
        )}
        </>
      </Paper>
    </div>
  )
}
