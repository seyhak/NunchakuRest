import {
  Category,
  MenuSet,
  OrderedProduct,
  Product,
} from "@/types/menu"
import {
  OrderedProductsState,
} from "@/types/kiosk"
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useState,
} from "react"
import "./Menu.sass"
import { omit } from "lodash"

export const handleSettingOrdered = (
  prevState: OrderedProductsState,
  item: Product | OrderedProduct,
  difference: number = 1
): OrderedProductsState => {
  const key = item.name
  const found = prevState?.[key]
  let newAmount = difference
  if (found) {
    newAmount = found.amount + difference
  }

  if (newAmount === 0) {
    const isTheOnlyProductInState =
      prevState && Object.keys(prevState).length === 1
    if (isTheOnlyProductInState) {
      return null
    }
    return omit({ ...prevState }, [key])
  }
  return {
    ...prevState,
    [key]: {
      name: item.name,
      price: item.price,
      amount: newAmount,
      id: item.id,
    },
  }
}

export const useCancelOrderDialog = (
  setOrderedProducts: Dispatch<SetStateAction<OrderedProductsState>>,
  setDrawerOpened: Dispatch<SetStateAction<boolean>>
) => {
  const [isCancelDialogOpened, setCancelDialogOpened] = useState(false)
  const onCancelClick = useCallback(() => {
    setCancelDialogOpened(true)
  }, [])
  const handleCancelConfirm = () => {
    setCancelDialogOpened(false)
    setOrderedProducts(null)
    setDrawerOpened(false)
  }
  const handleCancelCancel = () => {
    setCancelDialogOpened(false)
  }

  return {
    isCancelDialogOpened,
    handleCancelCancel,
    handleCancelConfirm,
    onCancelClick,
  }
}

export const createCategoryTiles = (
  categories: Category[],
  handler: (category: Category) => void
) => {
  return categories.map((sc) => ({
    id: sc.id,
    name: sc.name,
    onClick: () => handler(sc),
  }))
}
export const createProductsTiles = (
  products: Product[],
  handler: (product: Product) => void
) => {
  return products.map((poc) => ({
    id: poc.id,
    name: poc.name,
    onClick: () => handler(poc),
    price: poc.price,
  }))
}
export const createMenuSetsTiles = (
  sets: MenuSet[],
  handler: (set: MenuSet) => void
) => {
  return sets.map((s) => ({
    id: s.id,
    name: s.name,
    onClick: () => handler(s),
  }))
}
