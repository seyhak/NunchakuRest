"use client"

import { Menu as MenuType } from "@/types/menu"
import "./Menu.sass"
import { MenuItem } from "@/components/MenuItem/MenuItem"
import { Typography } from "@mui/material"
import classNames from "classnames"
import { ConfirmationDialog } from "@/components/ConfirmationDialog/ConfirmationDialog"
import { Summary } from "../Summary/Summary"
import { useMenu } from "./useMenu"
import { BackButton } from "@/components/BackButton/BackButton"

type MenuProps = {
  menu: MenuType;
};

export type Tile = {
  id: any;
  name: string;
  onClick: () => void;
  price?: string;
  className?: string;
};

export const Menu = ({ menu }: MenuProps) => {
  const {
    openedProducts,
    openedSet,
    openedSetStep,
    drawer,
    onBackArrowClick,
    cancelOrderDialog: {
      handleCancelConfirm,
      handleCancelCancel,
      isCancelDialogOpened,
    },
    confirmDialog,
    tiles,
  } = useMenu(menu)

  return (
    <div
      className={classNames("menu", { "drawer-open": drawer.isDrawerOpened })}
    >
      {openedSet?.name && (
        <>
          <Typography className="title">{openedSet?.name}</Typography>
          <Typography className="step">{openedSetStep?.name}</Typography>
        </>
      )}
      <div className="tiles">
        {openedProducts && <BackButton onClick={onBackArrowClick} />}
        {tiles.map((tile) => (
          <MenuItem
            onClick={tile.onClick}
            key={tile.id}
            name={tile.name}
            price={tile.price}
            className={tile.className}
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
