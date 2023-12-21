import { orderedProductsToSummaryAdapter, orderedMenuSetsToSummaryAdapter } from './Summary.utils'

// Mock data
const orderedProducts: any = {
  product1: { name: 'Product 1', amount: 2, price: '10.99' },
  product2: { name: 'Product 2', amount: 1, price: '5.99' },
}

const orderedMenuSets: any = {
  menuSet1: {
    products: [
      { name: 'Product A', price: '8.99' },
      { name: 'Product B', price: '12.99' },
    ],
    amount: 1,
  },
  menuSet2: {
    products: [
      { name: 'Product C', price: '15.99' },
      { name: 'Product D', price: '9.99' },
    ],
    amount: 2,
  },
}

// Mock functions
const handleRemoveProduct = jest.fn()
const handleRemoveMenuSet = jest.fn()

// Tests for orderedProductsToSummaryAdapter
describe('orderedProductsToSummaryAdapter', () => {
  it('should convert ordered products to summary items with handleRemove', () => {
    const result = orderedProductsToSummaryAdapter(orderedProducts, handleRemoveProduct)
    expect(result).toEqual([
      { name: 'Product 1', amount: 2, price: '10.99', handleRemove: expect.any(Function) },
      { name: 'Product 2', amount: 1, price: '5.99', handleRemove: expect.any(Function) },
    ])

    // Test handleRemove function
    result[0].handleRemove()
    expect(handleRemoveProduct).toHaveBeenCalledWith(orderedProducts.product1)
  })

  it('should return an empty array for undefined input', () => {
    const result = orderedProductsToSummaryAdapter(undefined, handleRemoveProduct)
    expect(result).toBeUndefined()
  })
})

// Tests for orderedMenuSetsToSummaryAdapter
describe('orderedMenuSetsToSummaryAdapter', () => {
  it('should convert ordered menu sets to summary items with handleRemove', () => {
    const result = orderedMenuSetsToSummaryAdapter(orderedMenuSets, handleRemoveMenuSet)
    expect(result).toEqual([
      { name: 'Product A, Product B', amount: 1, price: '21.98', handleRemove: expect.any(Function) },
      { name: 'Product C, Product D', amount: 2, price: '25.98', handleRemove: expect.any(Function) },
    ])

    // Test handleRemove function
    result[0].handleRemove()
    expect(handleRemoveMenuSet).toHaveBeenCalledWith('menuSet1')
  })

  it('should return an empty array for undefined input', () => {
    const result = orderedMenuSetsToSummaryAdapter(undefined, handleRemoveMenuSet)
    expect(result).toBeUndefined()
  })
})
