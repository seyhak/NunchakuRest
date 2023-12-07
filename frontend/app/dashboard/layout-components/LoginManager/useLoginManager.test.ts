import { renderHook, act, waitFor } from "@testing-library/react"
import { useLoginManager } from "./useLoginManager"

const logoutFetcher = jest.fn()
const loginFetcher = jest.fn()
const signUpFetcher = jest.fn()
const useCustomSWR = jest.fn()
const useUser = jest.fn()
const showMessage = jest.fn()
const setUser = jest.fn()
jest.mock("@/utils/get-cookie", () => ({
  __esModule: true,
  default: jest.fn(() => "mocked-csrf-token"), // Mock getCookie function
}))
jest.mock("@/axios/user", () => ({
  logoutFetcher: () => logoutFetcher(),
  loginFetcher: (a: any) => loginFetcher(a),
  signUpFetcher: () => signUpFetcher(),
}))
jest.mock("@/utils/crypto", () => ({
  __esModule: true,
  default: jest.fn(async () => "mocked-hash"), // Mock hashString function
}))
global.fetch = jest.fn()
console.error = jest.fn()

jest.mock("@/utils/use-swr", () => ({
  __esModule: true,
  useCustomSWR: () => useCustomSWR(),
}))

jest.mock("@/providers/user-provider", () => ({
  __esModule: true,
  useUser: () => useUser(),
}))
jest.mock("@/providers/snackbar-provider", () => ({
  __esModule: true,
  useSnackbar: () => ({
    showMessage,
  }),
}))

describe("useLoginManager", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    useCustomSWR.mockReturnValue({
      isLoading: false,
      data: null,
    })
    useUser.mockReturnValue({ user: null, setUser })
  })
  describe("drawer", () => {
    it("should toggle drawer state", () => {
      const { result } = renderHook(() => useLoginManager())

      expect(result.current.drawer.isUserDrawerOpen).toBeFalsy()
      act(() => {
        result.current.drawer.toggleDrawer()
      })

      // Assert: Drawer should be open
      expect(result.current.drawer.isUserDrawerOpen).toBeTruthy()
      act(() => {
        result.current.drawer.toggleDrawer()
      })

      expect(result.current.drawer.isUserDrawerOpen).toBeFalsy()
    })
  })
  describe("onSubmit", () => {
    it("should handle successful login", async () => {
      const { result } = renderHook(() => useLoginManager())

      const mockUser = { id: 1, username: "testUser" }
      loginFetcher.mockResolvedValue(mockUser)

      await act(() => {
        result.current.form.setValue("username", "testUser")
        result.current.form.setValue("password", "testPassword")
      })

      await act(async () => {
        await result.current.onSubmit(result.current.form.getValues())
      })
      expect(loginFetcher).toHaveBeenCalledWith({
        password: "mocked-hash",
        username: "testUser",
      })
      expect(setUser).toHaveBeenCalledWith(mockUser)
      expect(result.current.form.getValues()).toEqual({
        username: "",
        password: "",
        email: "",
        firstName: "",
        lastName: "",
      })
      expect(result.current.open).toBeFalsy()
    })

    it("should handle successful signup", async () => {
      const { result } = renderHook(() => useLoginManager())

      // Mock a successful signup response
      const mockUser = { id: 2, username: "newUser" }
      signUpFetcher.mockResolvedValueOnce(mockUser)

      // Set initial signup state
      act(() => {
        result.current.switchLoginManagerState()
        result.current.form.setValue("username", "newUser")
        result.current.form.setValue("password", "newPassword")
        result.current.form.setValue("email", "newUser@example.com")
        result.current.form.setValue("firstName", "newUser")
        result.current.form.setValue("lastName", "newUser")
      })

      // Act: Trigger signup
      await act(async () => {
        await result.current.onSubmit(result.current.form.getValues())
      })

      expect(setUser).toHaveBeenCalledWith(mockUser)
        expect(result.current.form.getValues()).toEqual({
          username: "",
          password: "",
          email: "",
          firstName: "",
          lastName: "",
        })
        expect(result.current.open).toBe(false)
    })
  })
})
