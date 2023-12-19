import { ReactNode } from "react"
import "./TileButton.sass"
import classNames from "classnames"
import { ButtonBase, ButtonBaseProps } from "@mui/material"

export type TileButtonProps = {
  children?: ReactNode
  className?: string
} & ButtonBaseProps

export const TileButton = ({className, children, ...props}: TileButtonProps) => {
  return (
    <ButtonBase className={classNames("tile-button", className)} {...props} >
      <div className="content">
        {children}
      </div>
    </ButtonBase>
  )
}
