import { Button, Typography } from "@mui/material"

import "./OrderedItem.sass"

export type OrderedItemProps = {
  // orderedProduct: OrderedProduct;
  // eslint-disable-next-line
  price: string
  amount: number
  name: string
  handleClick?: () => void;
};
export const OrderedItem = ({ name, price, amount, handleClick }: OrderedItemProps) => {
  return (
    <Button
      variant="contained"
      onClick={handleClick}
      className="ordered-item"
      size="large"
    >
      <Typography>{`${name} x ${amount}:`}</Typography>
      <Typography>{price}</Typography>
    </Button>
  )
}
