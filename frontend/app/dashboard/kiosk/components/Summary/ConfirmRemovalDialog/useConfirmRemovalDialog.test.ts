import {
  act,
  renderHook,
} from "@testing-library/react"
import { useConfirmRemovalDialog } from "./useConfirmRemovalDialog"

describe("useConfirmRemovalDialog", () => {
  it("opens and closes removal dialog", async () => {
    const someFn = jest.fn()
    const { result } = renderHook(() =>
      useConfirmRemovalDialog()
    )

    // Initial state
    expect(result.current.isRemovalDialogOpened).toBeFalsy()
    expect(result.current.itemName).toBeNull()

    // Trigger removal dialog open

    // Trigger removal dialog open
    await act(() => {
      result.current.decorateOnClick(() => someFn, "deedee")
    })

    // Ensure dialog is open and product to remove is set
    expect(result.current.isRemovalDialogOpened).toBeTruthy()
    expect(result.current.itemName).toEqual("deedee")

    // Trigger removal dialog close
    await act(() => {
      result.current.onRemoveProductClose()
    })

    // Ensure dialog is closed and product to remove is cleared
    expect(someFn).not.toHaveBeenCalled()
    expect(result.current.isRemovalDialogOpened).toBeFalsy()
    expect(result.current.itemName).toBeNull()
  })

  it("confirms removal on dialog confirmation", async () => {
    const someFn = jest.fn()
    const { result } = renderHook(() =>
      useConfirmRemovalDialog()
    )

    // Trigger removal dialog open
    await act(() => {
      result.current.decorateOnClick(() => someFn, "deedee")
    })
    await act(() => {
      result.current.onConfirmRemoveProduct()
    })

    // Trigger removal dialog confirmation
    await act(() => {
      result.current.onConfirmRemoveProduct()
    })

    // Ensure handleProductClick is called with the correct product
    expect(someFn).toHaveBeenCalledWith()
    // Ensure dialog is closed and product to remove is cleared
    expect(result.current.isRemovalDialogOpened).toBeFalsy()
    expect(result.current.itemName).toBeNull()
  })

  it("closes removal dialog on dialog close", async () => {
    const someFn = jest.fn()
    const { result } = renderHook(() =>
      useConfirmRemovalDialog()
    )

    // Trigger removal dialog open
    await act(() => {
      result.current.decorateOnClick(() => someFn, "deedee")
    })

    // Trigger removal dialog close
    await act(() => {
      result.current.onRemoveProductClose()
    })

    // Ensure dialog is closed and product to remove is cleared
    expect(someFn).not.toHaveBeenCalled()
    expect(result.current.isRemovalDialogOpened).toBeFalsy()
    expect(result.current.itemName).toBeNull()
  })
})
