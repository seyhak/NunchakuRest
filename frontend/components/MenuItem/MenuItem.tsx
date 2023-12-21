'use client'

import { Typography } from "@mui/material"
import "./MenuItem.sass"
import classNames from "classnames"
import { TileButton } from "../TileButton/TileButton"


export type MenuItemProps = {
  onClick: () => void
  name: string
  price?: string
  className?: string
}

export const MenuItem = ({onClick, price, name, className}: MenuItemProps) => {
  const hasPrice = typeof(price) !== "undefined"
  return (
    <TileButton onClick={onClick} className={classNames("menu-item", className, !hasPrice && "category")}>
      <>
        <Typography className="title">
          {name}
        </Typography>
        {hasPrice && <Typography className="price">
          {price}
        </Typography>}
      </>
    </TileButton>
  )
}
