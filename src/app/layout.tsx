import type { Metadata, Viewport } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'React Avançado - Boilerplate',
  description:
    'A simple project starter to work with TypeScript, React, Next.js and Tailwind CSS',
  icons: {
    icon: '/img/icon-512.png',
    apple: '/img/icon-512.png'
  }
}

export const viewport: Viewport = {
  themeColor: '#06092B'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
