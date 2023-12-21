import { renderHook, act } from '@testing-library/react'
import { useSummary } from './useSummary'

// Mock the context provider
jest.mock('@/providers/kiosk-provider', () => ({
  ...jest.requireActual('@/providers/kiosk-provider'),
  useKioskContext: jest.fn(),
}))

// Mock the context values
const mockContextValues = {
  orderedMenuSetsState: {
    orderedMenuSets: {
      menuSet1: {
        products: [{ name: 'Product A', price: 8.99 }, { name: 'Product B', price: 12.99 }],
        amount: 1,
      },
    },
  },
  orderedProductsState: {
    orderedProducts: {
      product1: { name: 'Product 1', amount: 2, price: 10.99 },
    },
  },
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(require('@/providers/kiosk-provider'), 'useKioskContext').mockReturnValue(mockContextValues)
})

describe('useSummary', () => {
  it('should calculate sum and orderedItems correctly', () => {
    const handleProductRemove = jest.fn()
    const handleMenuSetRemove = jest.fn()

    const { result } = renderHook(() => useSummary(handleProductRemove, handleMenuSetRemove))

    expect(result.current.sum).toEqual('32.97') // Expected sum = 10.99 + 8.99 + 12.99
    expect(result.current.orderedItems).toEqual([
      { name: 'Product 1', amount: 2, price: 10.99, handleRemove: expect.any(Function) },
      { name: 'Product A, Product B', amount: 1, price: '21.98', handleRemove: expect.any(Function) },
    ])

    // Test handleRemove functions
    act(() => {
      result.current.orderedItems[0].handleRemove()
    })
    expect(handleProductRemove).toHaveBeenCalledWith(mockContextValues.orderedProductsState.orderedProducts.product1)

    act(() => {
      result.current.orderedItems[1].handleRemove()
    })
    expect(handleMenuSetRemove).toHaveBeenCalledWith('menuSet1')
  })
})
