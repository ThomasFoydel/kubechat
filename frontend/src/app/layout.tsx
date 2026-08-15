import type { Metadata } from 'next'
import { Geist } from 'next/font/google'

import './globals.css'
import { Providers } from './providers'

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'KubeChat Dashboard',
  description: 'Kubernetes-native chat platform dashboard',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geist.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
