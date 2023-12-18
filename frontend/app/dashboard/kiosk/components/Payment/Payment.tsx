import { Button, Divider, Paper, Typography } from "@mui/material"
import { OrderedProductsState } from "../Menu/useMenu"
import "./Payment.sass"
import { PaymentMethods } from "../PaymentMethods/PaymentMethods"
import { useKiosk } from "../Kiosk/useKiosk"

import { Loader } from "@/components/Loader/Loader"
import { PaymentOrderId } from "../PaymentOrderId/PaymentOrderId"
import { usePayment } from "./usePayment"


type PaymentProps = {
  orderedProducts: OrderedProductsState;
  setPage: ReturnType<typeof useKiosk>['pageState']['setPage']
};
export const Payment = ({ orderedProducts, setPage }: PaymentProps) => {
  const {isLoading, handlePay, onBackButtonClick, orderId} = usePayment(orderedProducts, setPage)

  return (
    <div className="payment">
      <Paper elevation={3}>
        <>
        {!!orderId ? <PaymentOrderId orderId={orderId} setPage={setPage} /> : isLoading ? <Loader/> : orderedProducts ? (
          <>
          <div className="products">
            {Object.values(orderedProducts).map((op) => (
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
