import { useCallback, useState } from "react";

const TIMEOUT = 1000
/**
*    <button
*      onClick={handleClick}
*      onMouseDown={handleMouseDown}
*      onMouseUp={handleMouseUp}
*    >
*      {isHolding ? 'Holding...' : 'Click and Hold'}
*    </button>
 */
export const useClickAndHold = (func?: () => void) => {
  const [id, setId] = useState<NodeJS.Timeout | null>(null)

  const handleButtonPress = useCallback(() => {
    const buttonPressTimer = setTimeout(() => func?.(), TIMEOUT)
    setId(buttonPressTimer)
  }, [setId, func])

  const handleButtonRelease = useCallback(() => {
    clearTimeout(id!)
    setId(null)
  }, [setId, id])

  return {
    handleMouseDown: handleButtonPress,
    handleMouseUp: handleButtonRelease
  }
}

