import { orderedProductsToPaymentItemAdapter, orderedMenuSetsToPaymentItemAdapter } from './Payment.utils'

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

// Tests for orderedProductsToPaymentItemAdapter
describe('orderedProductsToPaymentItemAdapter', () => {
  it('should convert ordered products to payment items', () => {
    const result = orderedProductsToPaymentItemAdapter(orderedProducts)
    expect(result).toEqual([
      { name: 'Product 1', amount: 2, price: '10.99' },
      { name: 'Product 2', amount: 1, price: '5.99' },
    ])
  })

  it('should return an empty array for undefined input', () => {
    const result = orderedProductsToPaymentItemAdapter(undefined)
    expect(result).toBeUndefined()
  })
})

// Tests for orderedMenuSetsToPaymentItemAdapter
describe('orderedMenuSetsToPaymentItemAdapter', () => {
  it('should convert ordered menu sets to payment items', () => {
    const result = orderedMenuSetsToPaymentItemAdapter(orderedMenuSets)
    expect(result).toEqual([
      { name: 'Product A, Product B', amount: 1, price: '21.98' },
      { name: 'Product C, Product D', amount: 2, price: '25.98' },
    ])
  })

  it('should return an empty array for undefined input', () => {
    const result = orderedMenuSetsToPaymentItemAdapter(undefined)
    expect(result).toBeUndefined()
  })
})
