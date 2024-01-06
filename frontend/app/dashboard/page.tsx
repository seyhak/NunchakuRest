import { useContext } from 'react'
// import { Button } from '@mui/material'
import './dashboard.sass'
// import { ActiveThemeContext } from '@/theme/ThemeRegistry'
import { LoginManager } from './layout-components/LoginManager/LoginManager'

export default function Home() {
  // const {switchTheme} = useContext(ActiveThemeContext)
  return (
    <main className="main">
      <nav>
        <LoginManager/>
      </nav>
      {/* <div >
        Dashboard
        <Button onClick={switchTheme}>Switch</Button>
      </div> */}
    </main>
  )
}
