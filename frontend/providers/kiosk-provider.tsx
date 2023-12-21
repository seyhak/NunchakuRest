import {
  createContext,
  useContext,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
} from "react"

import { KioskPages, KioskPagesValues, OrderedMenuSetsState, OrderedProductsState } from "@/types/kiosk"


interface KioskContextProps {
  orderedProductsState: {
    orderedProducts: OrderedProductsState
    setOrderedProducts: Dispatch<SetStateAction<OrderedProductsState>>
  }
  orderedMenuSetsState: {
    orderedMenuSets: OrderedMenuSetsState
    setOrderedMenuSets: Dispatch<SetStateAction<OrderedMenuSetsState>>
  }
  resetState: () => void
  pageState: {
    page: KioskPagesValues
    setPage: Dispatch<SetStateAction<KioskPagesValues>>
  }
}

export const KioskContext = createContext<KioskContextProps | undefined>(
  undefined
)


// Custom hook to access user context
export const useKioskContext = () => {
  const context = useContext(KioskContext)

  if (!context) {
    throw new Error("useKioskContext must be used within a KioskContext")
  }
  return context
}

export const KioskProvider =  ({ children }: { children: ReactNode }) => {
    const [orderedProducts, setOrderedProducts] =
      useState<OrderedProductsState>(null)
    const [orderedMenuSets, setOrderedMenuSets] =
      useState<OrderedMenuSetsState>(null)
    const [page, setPage] = useState<KioskPagesValues>(KioskPages.MENU)
    const resetState = useCallback(() => {
      setOrderedMenuSets(null)
      setPage(KioskPages.MENU)
      setOrderedProducts(null)
    }, [])
    return (
      <KioskContext.Provider value={
          {
            orderedProductsState: {
            orderedProducts, setOrderedProducts
          },
          resetState,
          pageState: {
            page, setPage
          },
          orderedMenuSetsState: {
            orderedMenuSets, setOrderedMenuSets
          }
      }
      }>
        {children}
      </KioskContext.Provider>
    )
  }
  