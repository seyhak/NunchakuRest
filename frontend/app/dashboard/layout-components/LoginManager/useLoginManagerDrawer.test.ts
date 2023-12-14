import { renderHook, act } from '@testing-library/react'
import { useLoginManagerDrawer } from './useLoginManagerDrawer'
import { KIOSK_PATH, KITCHEN_PATH } from '@/constants/paths'
import { waitFor } from '@testing-library/react'

const mockLogoutFetcher = jest.fn()
const mockSetUser = jest.fn()
const mockShowMessage = jest.fn()
const mockPush = jest.fn()
jest.mock('@/fetchers/user', () => ({
  logoutFetcher: () => mockLogoutFetcher(),
}))

jest.mock('@/providers/user-provider', () => ({
  useUser: jest.fn(() => ({ setUser: (u: any) => mockSetUser(u), user: null })),
}))

jest.mock('@/providers/snackbar-provider', () => ({
  useSnackbar: jest.fn(() => ({ showMessage: (m: any) => mockShowMessage(m) })),
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: (path: any) => mockPush(path) })),
}))

describe('useLoginManagerDrawer', () => {
  it("should toggle drawer state", async() => {
    const { result } = renderHook(() => useLoginManagerDrawer())

    expect(result.current.isUserDrawerOpen).toBeFalsy()
    await act(() => {
      result.current.toggleDrawer()
    })

    expect(result.current.isUserDrawerOpen).toBeTruthy()
    await act(() => {
      result.current.toggleDrawer()
    })

    expect(result.current.isUserDrawerOpen).toBeFalsy()
  })

  it('should handle logout', async () => {
    mockLogoutFetcher.mockResolvedValue(null)
    const { result } = renderHook(() => useLoginManagerDrawer())

    await act(async () => {
      await result.current.handleLogout()
    })
    await waitFor(() => {
      expect(mockLogoutFetcher).toHaveBeenCalled()
      expect(result.current.isUserDrawerOpen).toBeFalsy()
      expect(mockSetUser).toHaveBeenCalledWith(null)
      expect(mockShowMessage).toHaveBeenCalledWith('Logout successful!')
    })
  })

  it('should handle kiosk click', async () => {
    const { result } = renderHook(() => useLoginManagerDrawer())

    await act(() => {
      result.current.handleKioskClick()
    })

    expect(mockPush).toHaveBeenCalledWith(KIOSK_PATH)
  })

  it('should handle kitchen click', async () => {
    const { result } = renderHook(() => useLoginManagerDrawer())

    await act(() => {
      result.current.handleKitchenClick()
    })

    expect(mockPush).toHaveBeenCalledWith(KITCHEN_PATH)
  })
})
