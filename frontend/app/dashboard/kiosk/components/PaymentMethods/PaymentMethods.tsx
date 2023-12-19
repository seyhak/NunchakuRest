import { PaymentMethods as PaymentMethodsType} from "@/types/menu"
import { Button } from "@mui/material"

import "./PaymentMethods.sass"

type PaymentMethodsProps = {
  handlePay: (paymentMethod: PaymentMethodsType) => Promise<void>
}
export const PaymentMethods = ({
  handlePay
}: PaymentMethodsProps) => {

  return (
    <div className="payment-methods">
      <Button onClick={() => handlePay(PaymentMethodsType.BLIK)} variant="contained" size="large">
        Blik
      </Button>
      <Button onClick={() => handlePay(PaymentMethodsType.CASH)} variant="contained" size="large">
        Cash
      </Button>
    </div>
  )
}
