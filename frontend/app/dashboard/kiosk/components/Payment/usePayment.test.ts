import { renderHook, act, waitFor } from "@testing-library/react"
import { useSnackbar } from "@/providers/snackbar-provider"
import { usePayment } from "./usePayment"

import { PaymentMethods } from "@/types/menu"

console.error = jest.fn()

jest.mock("@/providers/snackbar-provider", () => ({
  useSnackbar: jest.fn(),
}))
const createOrderFetcherMock = jest.fn()

jest.mock("@/fetchers/menu", () => ({
  createOrderFetcher: (x: any) => createOrderFetcherMock(x),
}))

const mockedUseSnackbar = useSnackbar as jest.MockedFunction<
  typeof useSnackbar
>
const orderedProducts = {
  prod1: {
    id: "prod1-prod1-prod1-prod1",
    name: "prod1",
    amount: 2,
    price: "41",
  },
  prod2: {
    id: "prod2-prod2-prod2-prod2",
    name: "prod2",
    amount: 2,
    price: "18",
  },
} as any
const orderedMenuSets = {
  menuSet1: {
    products: [{
    id: "prod3-prod3-prod3-prod3",
    name: "prod3",
    amount: 2,
    price: "41",
    },
    {
      id: "prod4-prod4-prod4-prod4",
      name: "prod4",
      amount: 2,
      price: "18",
    }],
  name: "abdul",
  id: "some-abdul-id",
  amount: 2,
  }
} as any

const setPage = jest.fn()

jest.mock("@/providers/kiosk-provider", () => ({
  useKioskContext: () => ({
    orderedProductsState: {
      orderedProducts,
    },
    orderedMenuSetsState: { orderedMenuSets },
    pageState: {
      setPage: (x: any) => setPage(x),
    },
  }),
}))
describe("usePayment", () => {
  beforeEach(() => {
    mockedUseSnackbar.mockReturnValue({
      showMessage: jest.fn(),
    })
  })

  it("handles payment and sets orderId on success", async () => {
    createOrderFetcherMock.mockResolvedValue({ orderId: "123" })

    const { result } = renderHook(() => usePayment())

    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.orderId).toBeNull()

    await act(async () => {
      result.current.handlePay(PaymentMethods.CASH)
    })

    expect(createOrderFetcherMock).toHaveBeenCalled()

    waitFor(() => {
      expect(result.current.isLoading).toBeFalsy()
      expect(result.current.orderId).toEqual("123")
      expect(createOrderFetcherMock).toHaveBeenCalledWith({
        menuSets: [
          {id: "some-abudul-id", amount: 2, products: [{id: "prod3-prod3-prod3-prod3"}, {id: "prod4-prod4-prod4-prod4"}]}
        ],
        products: [
          {
            amount: 2,
            id: "prod1-prod1-prod1-prod1",
          },
          {
            amount: 2,
            id: "prod2-prod2-prod2-prod2",
          },
        ], // Mocked products based on your use-case
        paymentMethod: PaymentMethods.CASH,
      })
    })
  })

  it("handles payment error and shows error message", async () => {
    createOrderFetcherMock.mockRejectedValue("Some Error")

    const { result } = renderHook(() => usePayment())

    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.orderId).toBeNull()

    await act(() => {
      result.current.handlePay(PaymentMethods.BLIK)
    })

    waitFor(() => {
      expect(result.current.isLoading).toBeFalsy()
      expect(result.current.orderId).toBeNull()
      expect(mockedUseSnackbar().showMessage).toHaveBeenCalledWith(
        "Something went wrong 😓",
        "error"
      )
    })
  })
})
