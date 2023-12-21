"use client"
import { Typography } from "@mui/material"

import "./PaymentOrderId.sass"
import { ProgressWithCounter } from "@/components/ProgressWithCounter/ProgressWithCounter"
import { usePaymentOrderId } from "./usePaymentOrderId"

type PaymentOrderIdProps = {
  orderId: string
}


export const PaymentOrderId = ({orderId}: PaymentOrderIdProps) => {
  const {counter, progress} = usePaymentOrderId()
  return (
    <div className="payment-order-id">
      <ProgressWithCounter counter={counter} progress={progress} />
      <Typography>
        Your order number is:
      </Typography>
      <Typography variant="h4">
        {orderId}
      </Typography>
    </div>
  )
}
