import { Category, KioskPages, OrderedProduct, Product } from "@/types/menu"
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react"
import "./Menu.sass"
import { omit } from "lodash"
import { useKiosk } from "../Kiosk/useKiosk"

export type OrderedProductsState = {
  [key: string]: OrderedProduct;
} | null;

const handleSettingOrderedProducts = (
  prevState: OrderedProductsState,
  item: Product | OrderedProduct,
  difference: number = 1
) => {
  const found = prevState?.[item.name]
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
    return omit({ ...prevState }, [item.name])
  }
  return {
    ...prevState,
    [item.name]: { name: item.name, price: item.price, amount: newAmount, id: item.id },
  }
}

const useCancelOrderDialog = (
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

export const useMenu = (
  categories: Category[],
  products: Product[],
  setPage: ReturnType<typeof useKiosk>["pageState"]["setPage"],
  orderedProductsState: ReturnType<typeof useKiosk>["orderedProductsState"]
) => {
  const [orderedProducts, setOrderedProducts] =
  useState<OrderedProductsState>(null)
  const [sum, setSum] = useState(0.0)
  const [isDrawerOpened, setDrawerOpened] = useState(false)
  const [isConfirmDialogOpened, setConfirmDialogOpened] = useState(false)
  const [openedCategories, setOpenedCategories] = useState<
    Product[] | Category[] | null
  >(null)
  const cancelOrderDialog = useCancelOrderDialog(
    setOrderedProducts,
    setDrawerOpened
  )

  const resetState = useCallback(() => {
    setDrawerOpened(false)
    setSum(0.0)
    setOpenedCategories(null)
  }, [])
  const onBackArrowClick = useCallback(() => {
    setOpenedCategories((prevState: any) => {
      const nextState = prevState?.splice(0, prevState.length - 1)
      return nextState?.length === 0 ? null : nextState
    })
  }, [])
  const onConfirmClick = useCallback(() => {
    setConfirmDialogOpened(true)
  }, [setConfirmDialogOpened])

  const handleConfirmDialogConfirm = useCallback(() => {
    setPage(KioskPages.PAYMENT as any)
    orderedProductsState.setOrderedProducts(orderedProducts)
    resetState()
    setConfirmDialogOpened(false)
  }, [setPage, resetState, orderedProductsState, orderedProducts])

  const handleConfirmDialogCancel = () => {
    setConfirmDialogOpened(false)
  }

  const onProductClick = useCallback(
    (item: Product) => {
      if (!isDrawerOpened) {
        setDrawerOpened(true)
      }
      setSum(
        (prevSum) => (prevSum * 100 + Number.parseFloat(item.price) * 100) / 100
      )
      setOrderedProducts((prevState: any) =>
        handleSettingOrderedProducts(prevState, item)
      )
    },
    [setSum, isDrawerOpened, setDrawerOpened, setOrderedProducts]
  )
  const handleProductRemove = useCallback(
    (item: OrderedProduct) => {
      setSum(
        (prevSum) => (prevSum * 100 - Number.parseFloat(item.price) * 100) / 100
      )
      setOrderedProducts((prevState: any) => {
        const nextState = handleSettingOrderedProducts(prevState, item, -1)
        if (!nextState || !Object.keys(nextState).length) {
          setDrawerOpened(false)
        }
        return nextState
      })
    },
    [setSum, setDrawerOpened, setOrderedProducts]
  )
  const onCategoryClick = useCallback(
    (item: Category) => {
      setOpenedCategories((prevState: any) => {
        if (prevState) {
          return [...prevState, item]
        } else {
          return [item]
        }
      })
    },
    [setOpenedCategories]
  )
  const tiles: (Category | Product)[] = useMemo(() => {
    if (openedCategories) {
      const subCategories = (
        openedCategories[openedCategories.length - 1] as Category
      )?.subCategories.map((c) => c)
      const productsOfCategory = (
        openedCategories[openedCategories.length - 1] as Category
      )?.products.map((c) => c)
      return [...subCategories, ...productsOfCategory]
    }
    return categories.concat(products as any)
  }, [categories, products, openedCategories])

  return {
    onProductClick,
    onCategoryClick,
    openedCategories,
    onBackArrowClick,
    cancelOrderDialog,
    confirmDialog: {
      handleConfirmDialogConfirm,
      handleConfirmDialogCancel,
      isConfirmDialogOpened,
    },
    drawer: {
      isDrawerOpened,
      handleProductRemove,
      sum,
      orderedProducts,
      onConfirmClick,
      onCancelClick: cancelOrderDialog.onCancelClick,
    },
    tiles,
  }
}
