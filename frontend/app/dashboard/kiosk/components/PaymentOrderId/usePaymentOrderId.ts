
import { useCallback, useEffect, useState } from "react"
import { KioskPages } from "@/types/menu"
import { useKiosk } from "../Kiosk/useKiosk"

const COUNTDOWN_MAX_SECONDS = 9

export const usePaymentOrderId = (setPage: ReturnType<typeof useKiosk>['pageState']['setPage']) => {
  const [counter, setCounter] = useState(COUNTDOWN_MAX_SECONDS)

  const redirectToKioskAfterCountdown = useCallback(async (countdown: number) => {
    setTimeout(() => {
      setCounter(prevState => prevState - 1)
      if(countdown === 0) {
        setPage(KioskPages.MENU)
      }
    }, 1000)
  }, [setCounter, setPage])

  useEffect(() => {
    redirectToKioskAfterCountdown(counter)
  }, [redirectToKioskAfterCountdown, counter])

  const progress = ((COUNTDOWN_MAX_SECONDS - counter) * 100) / COUNTDOWN_MAX_SECONDS
  return {
    counter, progress
  }
}
