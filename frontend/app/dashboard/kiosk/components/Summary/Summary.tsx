"use client"

import { Button, Divider, Drawer, Typography } from "@mui/material"
import { OrderedItem } from "../OrderedItem/OrderedItem"
import { ConfirmRemovalDialog } from "./ConfirmRemovalDialog/ConfirmRemovalDialog"
import { useConfirmRemovalDialog } from "./ConfirmRemovalDialog/useConfirmRemovalDialog"
import { OrderedProductsState } from "../Menu/useMenu"
import { OrderedProduct } from "@/types/menu"


export type SummaryProps = {
  drawer: {
    isDrawerOpened: boolean
    orderedProducts: OrderedProductsState
    onConfirmClick: any
    onCancelClick: any
    sum: number
    handleProductRemove: (item: OrderedProduct) => void
  },
}
export const Summary = ({
  drawer
}: SummaryProps) => {
  const {
    onOrderedItemClick,
    ...removalDialogProps
  } = useConfirmRemovalDialog(drawer.handleProductRemove)
  return (
    <>
    <Drawer variant="persistent" anchor="right" open={drawer.isDrawerOpened}>
        <div className="summary">
          <div className="products">
            {drawer.orderedProducts &&
              Object.values(drawer.orderedProducts).map((op) => (
                <OrderedItem
                  key={op.name}
                  orderedProduct={op}
                  handleClick={onOrderedItemClick}
                />
              ))}
          </div>
          <div className="controls">
            <Divider />
            <Typography>{`total: ${drawer.sum.toFixed(2)}`}</Typography>
            <Divider />
            <div className="buttons">
              <Button onClick={drawer.onConfirmClick} variant="contained" size="large">
                Confirm
              </Button>
              <Button
                onClick={drawer.onCancelClick}
                variant="contained"
                size="large"
                color="secondary"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>

      </Drawer>
      <ConfirmRemovalDialog {...removalDialogProps}/>
    </>
  )
}