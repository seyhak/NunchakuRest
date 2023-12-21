import {
  MenuSet,
  MenuSetStep,
  Product,
} from "@/types/menu"
import {
  OrderedMenuSetsState,
} from "@/types/kiosk"
import {
  useCallback,
  useState,
} from "react"
import "./Menu.sass"
import { omit } from "lodash"
import { useKioskContext } from "@/providers/kiosk-provider"

const handleSettingOrderedMenuSetsStateIntoOrderedMenuSets = (
  openedSetStepState: Product[],
  orderedMenuSetsState: OrderedMenuSetsState,
  openedSet: MenuSet,
  difference = 1
): OrderedMenuSetsState => {
  const joinedProductsName = openedSetStepState.map(product => product.name).join(', ')
  const foundMenuSetAmount = orderedMenuSetsState?.[joinedProductsName]?.amount || 0
  const returnValue: OrderedMenuSetsState = {
    ...orderedMenuSetsState,
    [joinedProductsName]: {
      amount: foundMenuSetAmount + difference,
      products: openedSetStepState,
      id: openedSet.id,
      name: openedSet.name,
    },
  }
  return returnValue
}

export const useOrderedMenuSets = () => {
  const [openedSet, setOpenedSet] = useState<MenuSet | null>(null)
  const [openedSetStep, setOpenedSetStep] = useState<MenuSetStep | null>(null)
  const [openedSetStepState, setOpenedSetStepState] = useState<Product[]>([])
  const {
    orderedMenuSetsState: { setOrderedMenuSets },
  } = useKioskContext()

  const onMenuSetClick = useCallback((item: MenuSet) => {
    setOpenedSet(item)
    setOpenedSetStep(item.setSteps[0])
  }, [])

  const onProductInStepClick = useCallback(
    (item: Product) => {
      setOpenedSetStep((prevOpenedSetStep) => {
        const indexOfOpenedSetStep =
          openedSet?.setSteps.findIndex(
            (ss) => ss.name == prevOpenedSetStep?.name
          ) || 0
        const setsLength = openedSet?.setSteps?.length || 0
        const hasNext = setsLength - 1 > indexOfOpenedSetStep

        const nextOpenedSetStepState = [...openedSetStepState, item]
        if (hasNext) {
          setOpenedSetStepState(nextOpenedSetStepState)
          return openedSet!.setSteps[indexOfOpenedSetStep + 1]
        }
        // add SET
        setOrderedMenuSets((prevOrderedMenuSetsState) => {
          let nextState: OrderedMenuSetsState | null = null
          nextState = handleSettingOrderedMenuSetsStateIntoOrderedMenuSets(
            nextOpenedSetStepState,
            prevOrderedMenuSetsState,
            openedSet!
          ) as any
          return nextState
        })
        setOpenedSet(null)
        setOpenedSetStepState([])
        return null
      })
    },
    [openedSetStepState, openedSet, setOrderedMenuSets]
  )
  const handleMenuSetRemove = useCallback(
    (itemKey: string) => {
      setOrderedMenuSets((prevState) => {
        const foundItem = prevState?.[itemKey]
        if(!foundItem) return prevState
        const nextAmount = foundItem.amount - 1
        if (nextAmount === 0){
          const nextState = omit(prevState, [itemKey])
          return Object.keys(nextState).length === 0 ? null : nextState
        }
        const nextState = {
          ...prevState,
          [itemKey]: {
            ...foundItem,
            amount: nextAmount
          }
        }
        return nextState
      })
    },
    [setOrderedMenuSets]
  )
  const resetState = useCallback(() => {
    setOpenedSet(null)
    setOpenedSetStep(null)
    setOpenedSetStepState([])
  }, [])
  return {
    onProductInStepClick,
    onMenuSetClick,
    openedSet,
    openedSetStep,
    resetState,
    handleMenuSetRemove
  }
}
