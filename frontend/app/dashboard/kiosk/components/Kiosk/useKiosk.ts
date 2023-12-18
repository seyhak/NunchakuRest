import { KioskPages, KioskPagesValues } from '@/types/menu'
import { useState } from 'react'
import { OrderedProductsState } from '../Menu/useMenu'


export const useKiosk = () => {
  const [page, setPage] = useState<KioskPagesValues>(KioskPages.MENU)
  const [orderedProducts, setOrderedProducts] =
    useState<OrderedProductsState>(null)
  return {
    orderedProductsState: {
      orderedProducts, setOrderedProducts
    },
    pageState: {
      page, setPage
    }
  }
}
