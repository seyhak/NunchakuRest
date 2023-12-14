import {
  act,
  renderHook,
} from "@testing-library/react"
import { useConfirmRemovalDialog } from "./useConfirmRemovalDialog"

describe("useConfirmRemovalDialog", () => {
  it("opens and closes removal dialog", async () => {
    const handleProductClick = jest.fn()
    const { result } = renderHook(() =>
      useConfirmRemovalDialog(handleProductClick)
    )

    // Initial state
    expect(result.current.isRemovalDialogOpened).toBeFalsy()
    expect(result.current.productToRemove).toBeNull()

    // Trigger removal dialog open
    await act(() => {
      result.current.onOrderedItemClick({
        amount: 1,
        name: "Product 1",
        price: "2.56",
      })
    })

    // Ensure dialog is open and product to remove is set
    expect(result.current.isRemovalDialogOpened).toBeTruthy()
    expect(result.current.productToRemove).toEqual({
      amount: 1,
      name: "Product 1",
      price: "2.56",
    })

    // Trigger removal dialog close
    await act(() => {
      result.current.onRemoveProductClose()
    })

    // Ensure dialog is closed and product to remove is cleared
    expect(handleProductClick).not.toHaveBeenCalled()
    expect(result.current.isRemovalDialogOpened).toBeFalsy()
    expect(result.current.productToRemove).toBeNull()
  })

  it("confirms removal on dialog confirmation", async () => {
    const handleProductClick = jest.fn()
    const { result } = renderHook(() =>
      useConfirmRemovalDialog(handleProductClick)
    )

    // Trigger removal dialog open
    await act(() => {
      result.current.onOrderedItemClick({
        amount: 1,
        name: "Product 1",
        price: "2.56",
      })
    })

    // Trigger removal dialog confirmation
    await act(() => {
      result.current.onConfirmRemoveProduct()
    })

    // Ensure handleProductClick is called with the correct product
    expect(handleProductClick).toHaveBeenCalledWith({
      amount: 1,
      name: "Product 1",
      price: "2.56",
    })
    // Ensure dialog is closed and product to remove is cleared
    expect(result.current.isRemovalDialogOpened).toBeFalsy()
    expect(result.current.productToRemove).toBeNull()
  })

  it("closes removal dialog on dialog close", async () => {
    const handleProductClick = jest.fn()
    const { result } = renderHook(() =>
      useConfirmRemovalDialog(handleProductClick)
    )

    // Trigger removal dialog open
    await act(() => {
      result.current.onOrderedItemClick({
        amount: 1,
        name: "Product 1",
        price: "2.56",
      })
    })

    // Trigger removal dialog close
    await act(() => {
      result.current.onRemoveProductClose()
    })

    // Ensure dialog is closed and product to remove is cleared
    expect(handleProductClick).not.toHaveBeenCalled()
    expect(result.current.isRemovalDialogOpened).toBeFalsy()
    expect(result.current.productToRemove).toBeNull()
  })
})
