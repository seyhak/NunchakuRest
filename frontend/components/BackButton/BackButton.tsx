import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined"
import { IconButton } from "@mui/material"
import "./BackButton.sass"
import classNames from "classnames"

export type BackButtonProps = {
  onClick: () => void
  className?: string
}
export const BackButton = ({onClick, className}: BackButtonProps) => {
  return (
    <IconButton onClick={onClick} className={classNames("BackButton", className)}>
    <ArrowBackIosOutlinedIcon />
  </IconButton>
  )
}
