import * as React from 'react'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Dialog from '@mui/material/Dialog'

export interface ConfirmationDialogProps {
  open: boolean;
  title: string
  onClose: () => void;
  onConfirm: () => void
  children: React.ReactNode
}

export function ConfirmationDialog({onClose, onConfirm, open, children, title}: ConfirmationDialogProps) {
  const handleCancel = () => {
    onClose()
  }

  return (
    <Dialog
      maxWidth="xs"
      open={open}
      onClose={onClose}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        {children}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={onConfirm}>Ok</Button>
      </DialogActions>
    </Dialog>
  )
}
