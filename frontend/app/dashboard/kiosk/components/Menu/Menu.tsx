"use client"

import { Menu as MenuType} from "@/types/menu"
import "./Menu.sass"
import { MenuItem } from "@/components/MenuItem/MenuItem"
import { Typography } from "@mui/material"
import classNames from "classnames"
import { ConfirmationDialog } from "@/components/ConfirmationDialog/ConfirmationDialog"
import { Summary } from "../Summary/Summary"
import { useMenu } from "./useMenu"
import { useKiosk } from "../Kiosk/useKiosk"
import { BackButton } from "@/components/BackButton/BackButton"

type MenuProps = {
  menu: MenuType;
  setPage: ReturnType<typeof useKiosk>['pageState']['setPage']
  orderedProductsState: ReturnType<typeof useKiosk>["orderedProductsState"]
};

export const Menu = ({menu: { categories, products, name }, setPage, orderedProductsState}: MenuProps) => {
  const {
    openedCategories,
    onProductClick,
    drawer,
    onCategoryClick,
    onBackArrowClick,
    cancelOrderDialog: {
      handleCancelConfirm,
      handleCancelCancel,
      isCancelDialogOpened,
    },
    confirmDialog,
    tiles,
  } = useMenu(categories, products, setPage, orderedProductsState)

  return (
    <div
      className={classNames("menu", { "drawer-open": drawer.isDrawerOpened })}
    >
      {/* <Typography className="title">{name}</Typography> */}
      <div className="tiles">
        {openedCategories && <BackButton onClick={onBackArrowClick} />}
            {tiles.map((c) => (
              <MenuItem
                handleProductClick={onProductClick}
                handleCategoryClick={onCategoryClick}
                key={c.id}
                menuItem={c}
              />
            ))}
      </div>
      <Summary
        drawer={{
          ...drawer,
        }}
      />
      <ConfirmationDialog
        title="Cancel order?"
        open={isCancelDialogOpened}
        onClose={handleCancelCancel}
        onConfirm={handleCancelConfirm}
      >
        <Typography>{`This will remove all current orders!`}</Typography>
      </ConfirmationDialog>
      <ConfirmationDialog
        title="Cancel order?"
        open={confirmDialog.isConfirmDialogOpened}
        onClose={confirmDialog.handleConfirmDialogCancel}
        onConfirm={confirmDialog.handleConfirmDialogConfirm}
      >
        <Typography>{`All done?`}</Typography>
      </ConfirmationDialog>
    </div>
  )
}
