'use client'
import { useMemo } from 'react'
import { Menu as MenuType } from '@/types/menu'
import Kiosk from './components/Kiosk/Kiosk'
import { useCustomSWR } from '@/utils/use-swr'
import './kiosk.sass'

const useKioskPage = () => {
  const { isLoading, data } = useCustomSWR<MenuType[]>("/api/menus/", {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
  })
  const menu = useMemo(() => {
    return data?.[0] || null
  }, [data])
  return {
    menu, isLoading
  }
}
export default function KioskPage() {
  const { menu, isLoading } = useKioskPage()

  return (
    <div className="kiosk">
      {menu && !isLoading ? <Kiosk menu={menu} /> : "No menu in DB!"}
    </div>
  )
}

