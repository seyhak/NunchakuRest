'use client'
import { useContext } from 'react'
import { Button } from '@mui/material'
import './dashboard.sass'
import { ActiveThemeContext } from '@/theme/ThemeRegistry'

export default function Home() {
  const {switchTheme} = useContext(ActiveThemeContext)
  return (
    <div >
      Dashboard
      <Button onClick={switchTheme}>Switch</Button>
    </div>
  )
}
