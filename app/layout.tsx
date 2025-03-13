import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ISS Tracker',
  description: 'An app to track the International Space Station',
}

import { Analytics } from "@vercel/analytics/react"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Analytics />
    </html>
  )
}
