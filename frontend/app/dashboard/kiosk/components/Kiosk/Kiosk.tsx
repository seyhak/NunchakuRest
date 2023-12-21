'use client'
import { Menu as MenuType } from "@/types/menu"
import {KioskPages} from "@/types/kiosk"
import { Menu } from "../Menu/Menu"
import { Payment } from "../Payment/Payment"
import { KioskContext, KioskProvider } from "@/providers/kiosk-provider"

export type KioskProps = {
  menu: MenuType;
};
export function Kiosk({ menu }: KioskProps) {
  return (
    <KioskProvider>
      <KioskContext.Consumer>
        {value => value?.pageState.page === KioskPages.MENU ? (
          <Menu
            menu={menu}
          />
        ) : (
          <Payment/>
        )}
      </KioskContext.Consumer>
    </KioskProvider>
  )
}

export default Kiosk
