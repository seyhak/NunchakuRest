import { renderHook, act } from "@testing-library/react"
import { usePaymentOrderId } from "./usePaymentOrderId"

jest.useFakeTimers()

const mockResetState = jest.fn()

jest.mock("@/providers/kiosk-provider", () => ({
  useKioskContext: () => ({
    resetState: () => mockResetState()
  })
}))

describe("usePaymentOrderId", () => {
  it("should redirect to Kiosk after countdown reaches 0", async () => {
    let result
    await act(() => {
      const hook = renderHook(() => usePaymentOrderId())
      result = hook.result
    })
    expect(result.current.counter).toEqual(9)
    expect(result.current.progress).toEqual(0)

    // Advance time by 1 second
    await act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(result.current.counter).toEqual(8)
    expect(result.current.progress.toFixed(2)).toEqual("11.11")
  })
})
