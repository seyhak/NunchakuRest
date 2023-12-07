"use client"
import { User } from "@/types/user"
import {
  createContext,
  useContext,
  useCallback,
  ReactNode,
  useState,
  useEffect,
} from "react"

import Snackbar from "@mui/material/Snackbar"
import IconButton from "@mui/material/IconButton"
import CloseIcon from "@mui/icons-material/Close"
import { Alert, AlertColor } from "@mui/material"

interface SnackbarContextProps {
  showMessage: (message: string, severity?: AlertColor) => void;
}

const SnackbarContext = createContext<SnackbarContextProps | undefined>(
  undefined
)

// Custom hook to access user context
export const useSnackbar = () => {
  const context = useContext(SnackbarContext)

  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarContext")
  }
  return context
}

type SnackbarProviderState = {
  open: boolean;
  message: string;
  severity?: AlertColor;
};

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<SnackbarProviderState>({
    open: false,
    message: "",
    severity: "success",
  })
  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    setState((prevState) => ({
      ...prevState,
      open: false,
    }))
  }
  const showMessage = useCallback(
    (message: string, severity: AlertColor = "success") => {
      setState({
        message,
        severity,
        open: true,
      })
    },
    []
  )

  const value = {
    showMessage,
  }

  return (
    <SnackbarContext.Provider value={value}>
      <Snackbar
        open={state.open}
        autoHideDuration={4000}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        <Alert severity={state.severity} sx={{ width: "100%" }}>
          {state.message}
        </Alert>
      </Snackbar>
      {children}
    </SnackbarContext.Provider>
  )
}
