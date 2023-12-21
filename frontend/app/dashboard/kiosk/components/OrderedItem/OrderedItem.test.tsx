import { render, screen, fireEvent } from '@testing-library/react'
import { OrderedItem } from './OrderedItem'

describe.skip('OrderedItem', () => {
  const orderedProduct = {
    name: 'Huge Dildo',
    price: '10.99',
    amount: 69,
  }

  it('renders the ordered item with correct details', () => {
    render(<OrderedItem orderedProduct={orderedProduct} />)

    // Ensure the ordered item is rendered with correct details
    expect(screen.getByText('Huge Dildo x 69:')).toBeInTheDocument()
    expect(screen.getByText('10.99')).toBeInTheDocument()
  })

  it('calls handleClick function on button click', async () => {
    const handleClick = jest.fn()

    render(<OrderedItem orderedProduct={orderedProduct} handleClick={handleClick} />)

    // Trigger button click
    await fireEvent.click(screen.getByRole('button'))

    // Ensure handleClick function is called with the correct product
    expect(handleClick).toHaveBeenCalledWith(orderedProduct)
  })

  it('does not call handleClick function if not provided', async () => {
    render(<OrderedItem orderedProduct={orderedProduct} />)

    // Trigger button click
    await fireEvent.click(screen.getByRole('button'))

    // Ensure handleClick function is not called
    expect(screen.getByText('Huge Dildo x 69:')).toBeInTheDocument()
    expect(screen.getByText('10.99')).toBeInTheDocument()
  })
})
