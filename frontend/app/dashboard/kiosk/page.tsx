import './kiosk.sass'
import { customFetcher } from '@/fetchers/custom-fetcher'
import { Menu as MenuType } from '@/types/menu'
import Kiosk from './components/Kiosk/Kiosk'

export async function Page() {
  const menus = await customFetcher<MenuType[]>("http://localhost:3000/api/menus/")
  const menu = menus![0]
  return (
      <div  className="kiosk">
        <Kiosk menu={menu}/>
      </div>
  )
}

export default Page
