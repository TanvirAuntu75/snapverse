'use client'

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from 'next-auth/react'
import { Sidebar } from '@/components/navigation/sidebar'
import { MobileNavigation } from '@/components/navigation/mobile-nav'
import { useState, useEffect } from 'react'

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <meta name="theme-color" content="#6366f1" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 overflow-x-hidden`}>
        <SessionProvider>
          <div className="flex min-h-screen">
            {/* Desktop Sidebar */}
            {!isMobile && <Sidebar />}
            
            {/* Main Content */}
            <main className={`flex-1 ${!isMobile ? 'md:ml-64' : ''} transition-all duration-300`}>
              <div className="max-w-4xl mx-auto px-4 py-8 pb-20 md:pb-8">
                {children}
              </div>
            </main>

            {/* Mobile Navigation */}
            {isMobile && <MobileNavigation />}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
