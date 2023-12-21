"use client"

import { Button, Divider, Drawer, Typography } from "@mui/material"
import { OrderedItem } from "../OrderedItem/OrderedItem"
import { ConfirmRemovalDialog } from "./ConfirmRemovalDialog/ConfirmRemovalDialog"
import { useConfirmRemovalDialog } from "./ConfirmRemovalDialog/useConfirmRemovalDialog"
import { OrderedProduct } from "@/types/menu"
import { useSummary } from "./useSummary"


export type SummaryProps = {
  drawer: {
    isDrawerOpened: boolean
    onConfirmClick: any
    onCancelClick: any
    // eslint-disable-next-line
    handleProductRemove: (item: OrderedProduct) => void
    // eslint-disable-next-line
    handleMenuSetRemove: (itemKey: string) => void
  },
}
export const Summary = ({
  drawer
}: SummaryProps) => {
  const {
    decorateOnClick,
    ...removalDialogProps
  } = useConfirmRemovalDialog()
  const {
    sum, orderedItems
  } = useSummary(drawer.handleProductRemove, drawer.handleMenuSetRemove)

  return (
    <>
    <Drawer variant="persistent" anchor="right" open={drawer.isDrawerOpened}>
        <div className="summary">
          <div className="products">
            {orderedItems.length &&
              orderedItems.map((op) => (
                <OrderedItem
                  key={op.name}
                  name={op.name}
                  amount={op.amount}
                  price={op.price}
                  handleClick={() => decorateOnClick(() => op.handleRemove, op.name)}
                />
              ))}
          </div>
          <div className="controls">
            <Divider />
            <Typography>{`total: ${sum}`}</Typography>
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
      <ConfirmRemovalDialog
      isOpened={removalDialogProps.isRemovalDialogOpened}
      itemName={removalDialogProps.itemName}
      onClose={removalDialogProps.onRemoveProductClose}
      onConfirm={removalDialogProps.onConfirmRemoveProduct}/>
    </>
  )
}
