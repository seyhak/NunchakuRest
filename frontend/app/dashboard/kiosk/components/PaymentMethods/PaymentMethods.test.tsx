import { render, fireEvent, waitFor } from '@testing-library/react'
import { PaymentMethods } from './PaymentMethods'
import { PaymentMethods as PaymentMethodsType } from '@/types/menu'

describe('PaymentMethods', () => {
  it('calls handlePay with BLIK when Blik button is clicked', async () => {
    const handlePayMock = jest.fn()
    const { getByText } = render(<PaymentMethods handlePay={handlePayMock} />)

    fireEvent.click(getByText('Blik'))

    await waitFor(() => {
      expect(handlePayMock).toHaveBeenCalledWith(PaymentMethodsType.BLIK)
    })
  })

  it('calls handlePay with CASH when Cash button is clicked', async () => {
    const handlePayMock = jest.fn()
    const { getByText } = render(<PaymentMethods handlePay={handlePayMock} />)

    fireEvent.click(getByText('Cash'))

    await waitFor(() => {
      expect(handlePayMock).toHaveBeenCalledWith(PaymentMethodsType.CASH)
    })
  })
})
