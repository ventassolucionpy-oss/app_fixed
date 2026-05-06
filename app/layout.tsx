export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import './globals.css'
import { PaisProvider } from '@/components/providers/PaisProvider'

export const metadata: Metadata = {
  title: 'Creatives Pro — Vender con Dropi',
  description: 'Tu herramienta para vender por internet en Paraguay, Colombia y México.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <PaisProvider>
          {children}
        </PaisProvider>
      </body>
    </html>
  )
}
