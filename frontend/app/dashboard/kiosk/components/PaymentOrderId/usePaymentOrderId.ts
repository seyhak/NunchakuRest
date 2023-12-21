
import { useCallback, useEffect, useState } from "react"
import { useKioskContext } from "@/providers/kiosk-provider"

const COUNTDOWN_MAX_SECONDS = 9

export const usePaymentOrderId = () => {
  const [counter, setCounter] = useState(COUNTDOWN_MAX_SECONDS)
  const {resetState} = useKioskContext()

  const redirectToKioskAfterCountdown = useCallback(async (countdown: number) => {
    setTimeout(() => {
      setCounter(prevState => prevState - 1)
      if(countdown === 0) {
        resetState()
      }
    }, 1000)
  }, [setCounter, resetState])

  useEffect(() => {
    redirectToKioskAfterCountdown(counter)
  }, [redirectToKioskAfterCountdown, counter])

  const progress = ((COUNTDOWN_MAX_SECONDS - counter) * 100) / COUNTDOWN_MAX_SECONDS
  return {
    counter, progress
  }
}
