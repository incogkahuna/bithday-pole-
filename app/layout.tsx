import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mammoth Weekend Poll',
  description: 'Vote on the best weekend for our Mammoth trip',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

