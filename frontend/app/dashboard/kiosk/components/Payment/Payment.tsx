import { Button, Divider, Paper, Typography } from "@mui/material"
import { OrderedProductsState } from "../Menu/useMenu"
import "./Payment.sass"
import { PaymentMethods } from "../PaymentMethods/PaymentMethods"
import { useKiosk } from "../Kiosk/useKiosk"
import { KioskPages } from "@/types/menu"

type PaymentProps = {
  orderedProducts: OrderedProductsState;
  setPage: ReturnType<typeof useKiosk>['pageState']['setPage']
};
export const Payment = ({ orderedProducts, setPage }: PaymentProps) => {
  const onBackButtonClick = () => {
    setPage(KioskPages.MENU)
  }
  return (
    <div className="payment">
      <Paper elevation={3}>
        <>
        {orderedProducts ? (
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
          <PaymentMethods />
          <Button onClick={onBackButtonClick}>
            Cancel Order
          </Button>
          </>
        ) : (
          <Typography>Nothing to show :C</Typography>
        )}
        </>
      </Paper>
    </div>
  )
}
