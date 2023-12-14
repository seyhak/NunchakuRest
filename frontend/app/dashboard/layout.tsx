import { Montserrat } from 'next/font/google'
import "./layout.sass"
import classNames from 'classnames'
import { LoginManager } from './layout-components/LoginManager/LoginManager'

const montserrat = Montserrat({ subsets: ['latin'] })



export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className={classNames(montserrat.className, "dashboard-main")}>
      {children}
    </main>
  )
}
