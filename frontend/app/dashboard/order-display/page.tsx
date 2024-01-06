"use client"
import { Loader } from "@/components/Loader/Loader"
import { OrderInKitchenButton } from "./components/OrderInKitchenButton/OrderInKitchenButton"
import "./order-display.sass"
import { useOrderDisplay } from "./useOrderDisplay"
import { Backdrop, Typography } from "@mui/material"
import { TileButton } from "@/components/TileButton/TileButton"

export default function OrderDisplay() {
  const { isLoading, data: orders, onButtonClick, handleCloseDialog, handleCompleteOrder, isControlDialogOpen } = useOrderDisplay()

  return (
    <section className="order-display">
      {
        isLoading ? <Loader/> : orders?.map(o => (
          <OrderInKitchenButton key={o.id} order={o} onClick={() => onButtonClick(o.id)} />
        ))
      }
      <Backdrop open={isControlDialogOpen} className="backdrop">
        <TileButton onClick={handleCompleteOrder}>
          <Typography>Close Order</Typography>
        </TileButton>
        <TileButton onClick={handleCloseDialog}>
          <Typography>Cancel</Typography>
        </TileButton>
      </Backdrop>
    </section>
  )
}
