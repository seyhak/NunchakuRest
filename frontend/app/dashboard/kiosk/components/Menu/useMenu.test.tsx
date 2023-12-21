import { renderHook, act } from "@testing-library/react"
import { useMenu } from "./useMenu"
import { KioskProvider } from "@/providers/kiosk-provider"

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
  const menuSets = [
    {
      id: "123W",
      name: "Wok",
      setSteps: [
        {
          name: "grains",
          products: [
            {
              id: "123",
              name: "wheat",
              price: "2.01",
            },
            {
              id: "123",
              name: "rice",
              price: "1.1",
            },
          ]
        },
        {
          name: "beans",
          products: [
            {
              id: "123R",
              name: "Red",
              price: "10.99",
            },
            {
              id: "123G",
              name: "Green",
              price: "10.99",
            },
          ]
        }
      ]
    }
  ] as any
  const menu: any = {
    categories, products, menuSets
  }

  const createWrapper = () => {
    return function CreatedWrapper({ children }: any) {
      return <KioskProvider >{children}</KioskProvider>
    }
  }

  it.skip("handles category click and updates opened categories", () => {
    const { result } = renderHook(() => useMenu(menu), { wrapper: createWrapper()})

    // Act: Trigger a category click
    act(() => {
      result.current.onCategoryClick(categories[0])
    })

    // Assert: Ensure opened categories are updated
    expect(result.current.openedCategories).toEqual([categories[0]])
  })
  test.skip("onBackArrowClick", async () => {
    const { result } = renderHook(() => useMenu(menu), { wrapper: createWrapper()})

    // expand category
    await act(() => {
      result.current.tilesonCategoryClick(categories[0])
    })
    expect(result.current.openedCategories).toEqual([categories[0]])
    // now go back
    await act(() => {
      result.current.onBackArrowClick()
    })
    expect(result.current.openedCategories).toBeNull()
  })
  test("tiles", () => {
    const { result } = renderHook(() => useMenu(menu), { wrapper: createWrapper()})

    expect(result.current.tiles).toEqual(
      [
        { id: '1', name: 'Category 1', onClick: expect.any(Function) },
        { id: '2', name: 'Category 2', onClick: expect.any(Function) },
        {
          id: '123',
          name: 'Huge Dildo',
          onClick: expect.any(Function),
          price: '10.99'
        },
        {
          id: '1234',
          name: 'Huge Dildo BLACK Turbo Spiral Destroyer',      
          onClick: expect.any(Function),
          price: '10.69'
        },
        { id: '123W', name: 'Wok', onClick: expect.any(Function)
  }
    ])
  })
})
