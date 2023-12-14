import { KioskPages } from '@/types/menu'
import { useState } from 'react'
import { OrderedProductsState } from '../Menu/useMenu'


export const useKiosk = () => {
  const [page, setPage] = useState<keyof typeof KioskPages>(KioskPages.MENU)
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