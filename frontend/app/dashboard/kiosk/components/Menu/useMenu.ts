import {
  Category,
  Menu,
  OrderedProduct,
  Product,
} from "@/types/menu"
import {
  KioskPages,
} from "@/types/kiosk"
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import "./Menu.sass"
import { useKioskContext } from "@/providers/kiosk-provider"
import { Tile } from "./Menu"
import { useOrderedMenuSets } from "./useOrderedMenuSets"
import { createCategoryTiles, createMenuSetsTiles, createProductsTiles, handleSettingOrdered, useCancelOrderDialog } from "./useMenu.utils"



export const useMenu = (menu: Menu) => {
  const {
    pageState: { setPage },
    orderedProductsState: { setOrderedProducts, orderedProducts },
    orderedMenuSetsState: { orderedMenuSets },
  } = useKioskContext()
  const { categories, menuSets, products } = menu
  const [isDrawerOpened, setDrawerOpened] = useState(false)
  const [isConfirmDialogOpened, setConfirmDialogOpened] = useState(false)
  const [openedProducts, setOpenedProducts] = useState<
    Product[] | Category[] | null
  >(null)
  const {
    openedSet,
    openedSetStep,
    onMenuSetClick,
    onProductInStepClick,
    resetState: resetMenuSetsState,
    handleMenuSetRemove,
  } = useOrderedMenuSets()

  const cancelOrderDialog = useCancelOrderDialog(
    setOrderedProducts,
    setDrawerOpened
  )
  useEffect(() => {
    if (!orderedMenuSets && !orderedProducts) {
      setDrawerOpened(false)
    } else if (!!orderedMenuSets || !!orderedProducts) {
      setDrawerOpened(true)
    }
  }, [orderedProducts, orderedMenuSets])

  const resetState = useCallback(() => {
    setDrawerOpened(false)
    setOpenedProducts(null)
    resetMenuSetsState()
  }, [resetMenuSetsState])

  const onBackArrowClick = useCallback(() => {
    setOpenedProducts((prevState: any) => {
      const nextState = prevState?.splice(0, prevState.length - 1)
      return nextState?.length === 0 ? null : nextState
    })
  }, [])
  const onConfirmClick = useCallback(() => {
    setConfirmDialogOpened(true)
  }, [setConfirmDialogOpened])

  const handleConfirmDialogConfirm = useCallback(() => {
    setPage(KioskPages.PAYMENT as any)
    resetState()
    setConfirmDialogOpened(false)
  }, [setPage, resetState])

  const handleConfirmDialogCancel = () => {
    setConfirmDialogOpened(false)
  }

  const withDrawerOpen = useCallback(<T>(func: (arg: T) => void) => {
    return (arg: T) => {
      setDrawerOpened(true)
      func(arg)
    }
  }, [])
  const onProductClick = withDrawerOpen(
    useCallback(
      (item: Product) => {
        setOrderedProducts((prevState: any) =>
          handleSettingOrdered(prevState, item)
        )
      },
      [setOrderedProducts]
    )
  )

  const handleProductRemove = useCallback(
    (item: OrderedProduct) => {
      setOrderedProducts((prevState: any) => {
        const nextState = handleSettingOrdered(prevState, item, -1)
        return nextState
      })
    },
    [setOrderedProducts]
  )
  const onCategoryClick = useCallback(
    (item: Category) => {
      setOpenedProducts((prevState: any) => {
        if (prevState) {
          return [...prevState, item]
        } else {
          return [item]
        }
      })
    },
    [setOpenedProducts]
  )

  const tiles: Tile[] = useMemo(() => {
    if (openedSetStep) {
      return createProductsTiles(openedSetStep.products, onProductInStepClick)
    }
    if (openedProducts) {
      const subCategories = (
        openedProducts[openedProducts.length - 1] as Category
      )?.subCategories.map((c) => c)
      const productsOfCategory = (
        openedProducts[openedProducts.length - 1] as Category
      )?.products.map((c) => c)
      const subCategoriesTiles = createCategoryTiles(
        subCategories,
        onCategoryClick
      )
      const productsOfCategoryTiles = createProductsTiles(
        productsOfCategory,
        onProductClick
      )
      return [...subCategoriesTiles, ...productsOfCategoryTiles]
    }
    return createCategoryTiles(categories, onCategoryClick)
      .concat(createProductsTiles(products, onProductClick))
      .concat(createMenuSetsTiles(menuSets, onMenuSetClick))
  }, [
    categories,
    products,
    menuSets,
    openedProducts,
    onCategoryClick,
    onProductClick,
    onMenuSetClick,
    openedSetStep,
    onProductInStepClick,
  ])

  return {
    openedSet,
    openedSetStep,
    openedProducts,
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
      handleMenuSetRemove,
      onConfirmClick,
      onCancelClick: cancelOrderDialog.onCancelClick,
    },
    tiles,
  }
}
