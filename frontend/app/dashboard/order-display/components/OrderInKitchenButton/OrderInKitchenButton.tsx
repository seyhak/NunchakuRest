import { TileButton } from "@/components/TileButton/TileButton"
import "./OrderInKitchenButton.sass"
import { OrderInOrdersDisplay } from "@/types/menu"
import { Divider, Typography } from "@mui/material"
import { useClickAndHold } from "@/utils/use-click-and-hold"

type OrderInKitchenButtonProps = {
  order: OrderInOrdersDisplay
  onClick: () => void
}
export const OrderInKitchenButton = ({
  order,
  onClick
}: OrderInKitchenButtonProps) => {
  const {
    handleMouseDown,
    handleMouseUp
  } = useClickAndHold(onClick)
  const createdAt = new Date(order.createdAt)

  return (
    <TileButton className="order-in-kitchen-btn" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
      <div className="header">
          <Typography>{`${createdAt.getHours()}:${createdAt.getMinutes()} ID:${order.orderId}`}</Typography>
        <div className="icons">
          <Typography>{order.deliveryMethod}</Typography>
          <Typography>{order.paymentMethod}</Typography>
          <Typography>{order.isPaid}</Typography>
        </div>
      </div>
      <Divider />
      <div className="menu-sets">
        {order.menuSets.map(item => (
          <div className="menu-set" key={item.id}>
            <Typography>
              {item.name}
            </Typography>
            <div className="menu-set-description">
            <Typography>
              {item.products}
            </Typography>
            <Typography className="amount">
              {`x${item.amount}`}
            </Typography></div>
          </div>)
        )}
      </div>
      <div className="products">
        {order.products.map(p => (
          <div className="product" key={p.id}>
          <Typography>
            {p.name}
          </Typography>
          <Typography className="amount">
            {`x${p.amount}`}
          </Typography>
          </div>)
        )}
      </div>
    </TileButton>
  )
}
