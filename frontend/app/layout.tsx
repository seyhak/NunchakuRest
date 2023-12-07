import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.sass'
import { ThemeRegistry } from '@/theme/ThemeRegistry'
import { UserProvider } from '@/providers/user-provider'
import { SnackbarProvider } from '@/providers/snackbar-provider'


const montserrat = Montserrat({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NunchakuRest',
  description: 'Your perfect restaurant manager',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <ThemeRegistry options={{ key: "mui" }}>
        <SnackbarProvider>
          <UserProvider>
            <body className={montserrat.className}>
              {children}
            </body>
          </UserProvider>
        </SnackbarProvider>
      </ThemeRegistry>
    </html>
  )
}
