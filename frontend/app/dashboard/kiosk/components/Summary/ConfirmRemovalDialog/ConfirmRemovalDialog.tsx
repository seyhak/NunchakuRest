import { Typography } from "@mui/material"
import { ConfirmationDialog } from "@/components/ConfirmationDialog/ConfirmationDialog"
import { useConfirmRemovalDialog } from "./useConfirmRemovalDialog"

export type ConfirmRemovalDialogProps = Omit<ReturnType<typeof useConfirmRemovalDialog>, "onOrderedItemClick">

export const ConfirmRemovalDialog = ({
  isRemovalDialogOpened,
  onRemoveProductClose,
  onConfirmRemoveProduct,
  productToRemove,
}: ConfirmRemovalDialogProps) => {
  return (
    <ConfirmationDialog
      title="Confirm removal"
      open={isRemovalDialogOpened}
      onClose={onRemoveProductClose}
      onConfirm={onConfirmRemoveProduct}
    >
      <Typography>{`Do you want to remove ${productToRemove?.name}?`}</Typography>
    </ConfirmationDialog>
  )
}
