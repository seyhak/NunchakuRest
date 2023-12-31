import React from 'react'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import { OrderInKitchenButton } from './OrderInKitchenButton'
import { act } from 'react-dom/test-utils'
import { OrderInOrdersDisplay } from '@/types/menu'


// Mock the useClickAndHold hook
jest.mock('@/utils/use-click-and-hold', () => ({
  useClickAndHold: jest.fn(() => ({
    handleMouseDown: jest.fn(),
    handleMouseUp: jest.fn(),
  })),
}))

describe('OrderInKitchenButton', () => {
  const order: OrderInOrdersDisplay = {
    orderId: '123',
    createdAt: new Date(2012, 6, 14, 14, 20),
    deliveryMethod: 'HR',
    paymentMethod: 'CS',
    isPaid: false,
    products: [
      { id: '1', name: 'Product1', amount: 2 },
      { id: '2', name: 'Product2', amount: 1 },
    ],
    menuSets: [
      { id: "3", name: '2 for U', products: "cheeseburger, fries"}
    ],
  }

  it('renders order details correctly', () => {
    render(<OrderInKitchenButton order={order} onClick={() => {}} />)

    // Assert order details are rendered correctly
    expect(screen.getByText(`14:20 ID:${order.orderId}`)).toBeInTheDocument()
    expect(screen.getByText(order.deliveryMethod)).toBeInTheDocument()
    expect(screen.getByText(order.paymentMethod)).toBeInTheDocument()

    // Assert product details are rendered correctly
    order.products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument()
      expect(screen.getByText(`x${product.amount}`)).toBeInTheDocument()
    })
    expect(screen.getByText("2 for U")).toBeInTheDocument()
    expect(screen.getByText("cheeseburger, fries")).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const onClick = jest.fn()

    render(<OrderInKitchenButton order={order} onClick={onClick} />)

    // Simulate a click
    await act(async () => {
      fireEvent.click(screen.getByRole('button'))
    })

    waitFor(() => {
      expect(onClick).toHaveBeenCalledTimes(1)
    })
  })
})
