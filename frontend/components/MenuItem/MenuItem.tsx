'use client'
import { Category, Product } from "@/types/menu"
import { Typography } from "@mui/material"
import "./MenuItem.sass"
import classNames from "classnames"
import { TileButton } from "../TileButton/TileButton"


export type MenuItemProps = {
  menuItem: Category | Product,
  handleProductClick: (menuItem: Product) => void
  handleCategoryClick: (menuItem: Category) => void
}
const useMenuItem = (item: Category | Product, handleProductClick: (menuItem: Product) => void, handleCategoryClick: (category: Category) => void, isCategory: boolean) => {
  const onClick = () => {
    if(isCategory) {
      console.log("open", item)
      handleCategoryClick(item as Category)
    } else {
      handleProductClick(item as Product)
    }
  }

  return {
    onClick
  }
}
export const MenuItem = ({menuItem, handleProductClick, handleCategoryClick}: MenuItemProps) => {
  const isCategory = typeof (menuItem as any).price !== "string"
  const {onClick} = useMenuItem(menuItem, handleProductClick, handleCategoryClick, isCategory)
  return (
    <TileButton onClick={onClick} className={classNames("menu-item", isCategory && "category")}>
      <>
        <Typography className="title">
          {menuItem.name}
        </Typography>
        {!isCategory && <Typography className="price">
          {(menuItem as Product).price}
        </Typography>}
      </>
    </TileButton>
  )
}
