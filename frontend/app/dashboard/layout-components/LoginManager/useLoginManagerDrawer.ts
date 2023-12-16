'use client'
import * as React from "react"
import { logoutFetcher } from "@/fetchers/user"
import { useUser } from "@/providers/user-provider"
import { useSnackbar } from "@/providers/snackbar-provider"
import { useRouter } from "next/navigation"
import { KIOSK_PATH, KITCHEN_PATH } from "@/constants/paths"


export const useLoginManagerDrawer = () => {
  const [isUserDrawerOpen, setUserDrawerOpen] = React.useState(false)
  const userContext = useUser()
  const snackbarContext = useSnackbar()
  const router = useRouter()

  const toggleDrawer = React.useCallback(() => {
    setUserDrawerOpen(prevState => !prevState)
  }, [setUserDrawerOpen])

  const handleLogout = React.useCallback(
    async () => {
      await logoutFetcher()
      setUserDrawerOpen(false)
      userContext.setUser(null)
      snackbarContext.showMessage("Logout successful!")
    },
    [snackbarContext, userContext]
  )

  const handleKioskClick = React.useCallback(
    async () => {
      router.push(KIOSK_PATH)
    },
    [router]
  )

  const handleKitchenClick = React.useCallback(
    async () => {
      router.push(KITCHEN_PATH)
    },
    [router]
  )
  return {
    isUserDrawerOpen,
    handleLogout,
    toggleDrawer,
    handleKioskClick,
    handleKitchenClick
  }
}
