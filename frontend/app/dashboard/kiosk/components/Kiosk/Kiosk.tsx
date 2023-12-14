'use client'
import { KioskPages, Menu as MenuType } from "@/types/menu"
import { Menu } from "../Menu/Menu"
import { Payment } from "../Payment/Payment"
import { useKiosk } from "./useKiosk"

export type KioskProps = {
  menu: MenuType;
};
export function Kiosk({ menu }: KioskProps) {
  const {orderedProductsState, pageState} = useKiosk()

  return (
    <>
      {pageState.page === KioskPages.MENU ? (
        <Menu
          menu={menu}
          setPage={pageState.setPage}
          orderedProductsState={orderedProductsState}
        />
      ) : (
        <Payment orderedProducts={orderedProductsState.orderedProducts} 
        setPage={pageState.setPage}/>
      )}
    </>
  )
}

export default Kiosk
