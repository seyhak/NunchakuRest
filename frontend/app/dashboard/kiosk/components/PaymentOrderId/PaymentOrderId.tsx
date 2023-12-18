"use client"
import { Typography } from "@mui/material"

import "./PaymentOrderId.sass"
import { useKiosk } from "../Kiosk/useKiosk"
import { ProgressWithCounter } from "@/components/ProgressWithCounter/ProgressWithCounter"
import { usePaymentOrderId } from "./usePaymentOrderId"

type PaymentOrderIdProps = {
  orderId: string
  setPage: ReturnType<typeof useKiosk>['pageState']['setPage']
}


export const PaymentOrderId = ({orderId, setPage}: PaymentOrderIdProps) => {
  const {counter, progress} = usePaymentOrderId(setPage)
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
