import { OrderedProduct } from "@/types/menu"
import { Button, Typography } from "@mui/material"

import "./OrderedItem.sass"

export type OrderedItemProps = {
  orderedProduct: OrderedProduct;
  handleClick?: (item: OrderedProduct) => void;
};
export const OrderedItem = ({ orderedProduct, handleClick }: OrderedItemProps) => {
  const { name, price, amount } = orderedProduct
  return (
    <Button
      variant="contained"
      onClick={() => handleClick?.(orderedProduct)}
      className="ordered-item"
      size="large"
    >
      <Typography>{`${name} x ${amount}:`}</Typography>
      <Typography>{price}</Typography>
    </Button>
  )
}
