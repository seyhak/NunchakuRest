import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { LoginManager } from './LoginManager'
import { LoginManagerStates } from './useLoginManager'

// Mock useLoginManager hook
jest.mock('./useLoginManager', () => ({
  ...jest.requireActual('./useLoginManager'),
  useLoginManager: jest.fn(() => ({
    form: {
      control: {},
      handleSubmit: jest.fn(),
      formState: { errors: {} },
    },
    onSubmit: jest.fn(),
    handleCancel: jest.fn(),
    handleClose: jest.fn(),
    handleClickOpen: jest.fn(),
    open: false,
    loginManagerState: LoginManagerStates.LOGIN,
    switchLoginManagerState: jest.fn(),
    errorMsg: '',
    user: null,
    drawer: {
      toggleDrawer: jest.fn(),
      handleLogout: jest.fn(),
      handleKioskClick: jest.fn(),
      handleKitchenClick: jest.fn(),
      isUserDrawerOpen: false,
    },
    isLoading: false,
  })),
}))

describe.skip('LoginManager', () => {
  // it('renders the component', () => {
  //   render(<LoginManager open={false} selectedValue="" onClose={() => {}} />);

  // });

  it.only('handles login form submission', async () => {
    render(<LoginManager open={true} selectedValue="" onClose={() => {}} />)
    //toggle dialog
    await act(() => {
      fireEvent.click(screen.getByTestId("AccountCircleIcon"))
    })
    // Mocking form input values
    const usernameInput = screen.getByLabelText('Login')
    const passwordInput = screen.getByLabelText('Password')

    await act(() => {
      fireEvent.change(usernameInput, { target: { value: 'testUser' } })
      fireEvent.change(passwordInput, { target: { value: 'testPassword' } })
    })

    const submitButton = screen.getByText('Login')

    await act(() => {
      fireEvent.click(submitButton)
    })

    // You can add assertions based on the expected behavior after form submission
    await waitFor(() => {
      // Add assertions here
    })
  })
  it('handles signup form submission', async () => {
    render(<LoginManager open={true} selectedValue="" onClose={() => {}} />)

    // Switch to the signup form
    const switchButton = screen.getByText('Need Account? Sign Up')
    act(() => {
      fireEvent.click(switchButton)
    })

    // Mocking form input values for signup
    const usernameInput = screen.getByLabelText('Login')
    const passwordInput = screen.getByLabelText('Password')
    const emailInput = screen.getByLabelText('Email')
    const firstNameInput = screen.getByLabelText('First name')
    const lastNameInput = screen.getByLabelText('Last name')

    act(() => {
      fireEvent.change(usernameInput, { target: { value: 'testUser' } })
      fireEvent.change(passwordInput, { target: { value: 'testPassword' } })
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(firstNameInput, { target: { value: 'John' } })
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } })
    })

    const submitButton = screen.getByText('Sign Up')

    act(() => {
      fireEvent.click(submitButton)
    })

    // You can add assertions based on the expected behavior after signup form submission
    await waitFor(() => {
      // Add assertions here
    })
  })

  it('toggles between login and signup forms', () => {
    render(<LoginManager open={true} selectedValue="" onClose={() => {}} />)

    // Switch to the signup form
    const switchButton = screen.getByText('Need Account? Sign Up')
    act(() => {
      fireEvent.click(switchButton)
    })

    // Ensure that the form elements for signup are visible
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('First name')).toBeInTheDocument()
    expect(screen.getByLabelText('Last name')).toBeInTheDocument()

    // Switch back to the login form
    act(() => {
      fireEvent.click(switchButton)
    })

    // Ensure that the form elements for signup are not visible
    expect(screen.queryByLabelText('Email')).toBeNull()
    expect(screen.queryByLabelText('First name')).toBeNull()
    expect(screen.queryByLabelText('Last name')).toBeNull()
  })
  it('displays error message on login failure', async () => {
    // Mocking a login failure scenario
    useLoginManager.mockReturnValueOnce({
      ...initialMockedValues,
      onSubmit: jest.fn().mockRejectedValueOnce(new Error('Login failed')),
    })

    render(<LoginManager open={true} selectedValue="" onClose={() => {}} />)

    // Mocking form input values
    const usernameInput = screen.getByLabelText('Login')
    const passwordInput = screen.getByLabelText('Password')

    act(() => {
      fireEvent.change(usernameInput, { target: { value: 'testUser' } })
      fireEvent.change(passwordInput, { target: { value: 'testPassword' } })
    })

    const submitButton = screen.getByText('Login')

    act(() => {
      fireEvent.click(submitButton)
    })

    // Ensure that the error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Login failed')).toBeInTheDocument()
    })
  })

  it('displays error message on signup failure', async () => {
    // Mocking a signup failure scenario
    useLoginManager.mockReturnValueOnce({
      ...initialMockedValues,
      switchLoginManagerState: jest.fn(),
      onSubmit: jest.fn().mockRejectedValueOnce(new Error('Signup failed')),
    })

    render(<LoginManager open={true} selectedValue="" onClose={() => {}} />)

    // Switch to the signup form
    const switchButton = screen.getByText('Need Account? Sign Up')
    act(() => {
      fireEvent.click(switchButton)
    })

    // Mocking form input values for signup
    const usernameInput = screen.getByLabelText('Login')
    const passwordInput = screen.getByLabelText('Password')
    const emailInput = screen.getByLabelText('Email')
    const firstNameInput = screen.getByLabelText('First name')
    const lastNameInput = screen.getByLabelText('Last name')

    act(() => {
      fireEvent.change(usernameInput, { target: { value: 'testUser' } })
      fireEvent.change(passwordInput, { target: { value: 'testPassword' } })
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(firstNameInput, { target: { value: 'John' } })
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } })
    })

    const submitButton = screen.getByText('Sign Up')

    act(() => {
      fireEvent.click(submitButton)
    })

    // Ensure that the error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Signup failed')).toBeInTheDocument()
    })
  })

  it('handles cancel button click', () => {
    render(<LoginManager open={true} selectedValue="" onClose={() => {}} />)

    const cancelButton = screen.getByText('Cancel')
    act(() => {
      fireEvent.click(cancelButton)
    })

    // Ensure that the handleCancel function is called
    expect(initialMockedValues.handleCancel).toHaveBeenCalled()
  })
// ... (previous imports and setup)

  // ... (previous tests)

  it('displays loading state during form submission', async () => {
    // Mocking loading state during form submission
    useLoginManager.mockReturnValueOnce({
      ...initialMockedValues,
      isLoading: true,
    })

    render(<LoginManager open={true} selectedValue="" onClose={() => {}} />)

    // Mocking form input values
    const usernameInput = screen.getByLabelText('Login')
    const passwordInput = screen.getByLabelText('Password')

    act(() => {
      fireEvent.change(usernameInput, { target: { value: 'testUser' } })
      fireEvent.change(passwordInput, { target: { value: 'testPassword' } })
    })

    const submitButton = screen.getByText('Login')

    act(() => {
      fireEvent.click(submitButton)
    })

    // Ensure that the loading state is displayed
    await waitFor(() => {
      expect(screen.getByText('loading')).toBeInTheDocument()
    })
  })

  it('displays user avatar when signed in', () => {
    // Mocking signed-in state
    useLoginManager.mockReturnValueOnce({
      ...initialMockedValues,
      user: { firstName: 'John', lastName: 'Doe' },
    })

    render(<LoginManager open={false} selectedValue="" onClose={() => {}} />)

    // Ensure that the user avatar is displayed
    expect(screen.getByAltText('User Avatar')).toBeInTheDocument()
  })

  it('toggles user drawer on user avatar click', () => {
    // Mocking signed-in state
    useLoginManager.mockReturnValueOnce({
      ...initialMockedValues,
      user: { firstName: 'John', lastName: 'Doe' },
    })

    render(<LoginManager open={false} selectedValue="" onClose={() => {}} />)

    // Trigger user avatar click
    const userAvatar = screen.getByAltText('User Avatar')
    act(() => {
      fireEvent.click(userAvatar)
    })

    // Ensure that the user drawer toggle function is called
    expect(initialMockedValues.drawer.toggleDrawer).toHaveBeenCalled()
  })

  // Add more tests for other scenarios, user interactions, etc.
})

