import { Typography } from "@mui/material"
import { ConfirmationDialog } from "@/components/ConfirmationDialog/ConfirmationDialog"

export type ConfirmRemovalDialogProps = {
  itemName: string | null
  onConfirm: () => void
  onClose: () => void
  isOpened: boolean
}

export const ConfirmRemovalDialog = ({
  isOpened,
  onClose,
  onConfirm,
  itemName,
}: ConfirmRemovalDialogProps) => {
  return (
    <ConfirmationDialog
      title="Confirm removal"
      open={isOpened}
      onClose={onClose}
      onConfirm={onConfirm}
    >
      <Typography>{`Do you want to remove ${itemName}?`}</Typography>
    </ConfirmationDialog>
  )
}
