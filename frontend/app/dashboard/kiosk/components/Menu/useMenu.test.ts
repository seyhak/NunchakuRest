import { renderHook, act } from "@testing-library/react"
import { useMenu } from "./useMenu"
import { useState } from "react"

describe("useMenu", () => {
  // Mocked data for categories and products
  const categories = [
    { id: "1", name: "Category 1", subCategories: [], products: [] },
    { id: "2", name: "Category 2", subCategories: [], products: [] },
  ] as any
  const products = [
    {
      id: "123",
      name: "Huge Dildo",
      price: "10.99",
    },
    {
      id: "1234",
      name: "Huge Dildo BLACK Turbo Spiral Destroyer",
      price: "10.69",
    },
  ] as any

  // Mocked setPage function
  const setPage = jest.fn()

  // Mocked useKiosk hook state
  const mockSetOrderedProducts = jest.fn()
  const orderedProductsState = {
    orderedProducts: null,
    setOrderedProducts: mockSetOrderedProducts,
  }
  const useWrappedHook = (categories: any, products: any) => {
    const [orderedProducts, setOrderedProducts] = useState<any>(null)
    const orderedProductsState = { orderedProducts, setOrderedProducts }
    const hook = useMenu(categories, products, setPage, orderedProductsState)
    return {
      ...hook,
    }
  }

  it("calculates sum and updates ordered products onProductClick", async () => {
    const { result } = renderHook(() => useWrappedHook(categories, products))

    // Act: Trigger a product click
    await act(() => {
      result.current.onProductClick(products[0])
    })

    // Assert: Ensure sum is updated
    expect(result.current.drawer.sum).toEqual(10.99)

    // Assert: Ensure ordered products are updated
    expect(result.current.drawer.orderedProducts).toEqual({
      "Huge Dildo": { amount: 1, name: "Huge Dildo", price: "10.99", id: "123" },
    })
    // second click
    await act(() => {
      result.current.onProductClick(products[0])
    })

    // Assert: Ensure sum is updated
    expect(result.current.drawer.sum).toEqual(21.98)

    // Assert: Ensure ordered products are updated
    expect(result.current.drawer.orderedProducts).toEqual({
      "Huge Dildo": { amount: 2, name: "Huge Dildo", price: "10.99", id: "123" },
    })

    // third click
    await act(() => {
      result.current.onProductClick(products[1])
    })

    // Assert: Ensure sum is updated
    expect(result.current.drawer.sum).toEqual(32.67)

    expect(result.current.drawer.orderedProducts).toEqual({
      "Huge Dildo": { amount: 2, name: "Huge Dildo", price: "10.99", id: "123" },
      "Huge Dildo BLACK Turbo Spiral Destroyer": {
        amount: 1,
        name: "Huge Dildo BLACK Turbo Spiral Destroyer",
        price: "10.69",
        id: "1234"
      },
    })
  })

  it("calculates sum and updates ordered products onProductClick", async () => {
    const { result } = renderHook(() => useWrappedHook(categories, products))

    // Act: Trigger a product click
    await act(() => {
      result.current.onProductClick(products[0])
      result.current.onProductClick(products[0])
      result.current.onProductClick(products[1])
    })
    // Assert: Ensure sum is updated
    expect(result.current.drawer.sum).toEqual(32.67)

    expect(result.current.drawer.orderedProducts).toEqual({
      "Huge Dildo": { amount: 2, name: "Huge Dildo", price: "10.99", id: "123", },
      "Huge Dildo BLACK Turbo Spiral Destroyer": {
        amount: 1,
        id: "1234",
        name: "Huge Dildo BLACK Turbo Spiral Destroyer",
        price: "10.69",
      },
    })
    // remove one of products
    await act(() => {
      result.current.drawer.handleProductRemove(products[0])
    })
    expect(result.current.drawer.sum).toEqual(21.68)

    expect(result.current.drawer.orderedProducts).toEqual({
      "Huge Dildo": { amount: 1, name: "Huge Dildo", price: "10.99",  id: "123" },
      "Huge Dildo BLACK Turbo Spiral Destroyer": {
        amount: 1,
        id: "1234",
        name: "Huge Dildo BLACK Turbo Spiral Destroyer",
        price: "10.69",
      },
    })
  })

  it("handles category click and updates opened categories", () => {
    const { result } = renderHook(() =>
      useMenu(categories, products, setPage, orderedProductsState)
    )

    // Act: Trigger a category click
    act(() => {
      result.current.onCategoryClick(categories[0])
    })

    // Assert: Ensure opened categories are updated
    expect(result.current.openedCategories).toEqual([categories[0]])
  })
  test("onBackArrowClick", async () => {
    const { result } = renderHook(() =>
      useMenu(categories, products, setPage, orderedProductsState)
    )
    // expand category
    await act(() => {
      result.current.onCategoryClick(categories[0])
    })
    expect(result.current.openedCategories).toEqual([categories[0]])
    // now go back
    await act(() => {
      result.current.onBackArrowClick()
    })
    expect(result.current.openedCategories).toBeNull()
  })
  test("tiles", () => {
    const { result } = renderHook(() =>
      useMenu(categories, products, setPage, orderedProductsState)
    )

    expect(result.current.tiles).toEqual([
      categories[0],
      categories[1],
      products[0],
      products[1],
    ])
  })
})
