import { render, screen, waitFor } from '@testing-library/react'
import { PaymentOrderId } from './PaymentOrderId'

jest.mock('./usePaymentOrderId', () => ({
  __esModule: true,
  usePaymentOrderId: jest.fn(() => ({ counter: 5, progress: 50 })),
}))

describe('PaymentOrderId', () => {
  it('renders the component with order number and progress', async () => {
    const setPageMock = jest.fn()
    render(<PaymentOrderId orderId="123" setPage={setPageMock} />)

    // Wait for the progress to be updated
    await waitFor(() => {
      expect(screen.getByText('Your order number is:')).toBeInTheDocument()
      expect(screen.getByText('123')).toBeInTheDocument()
    })
  })
})
