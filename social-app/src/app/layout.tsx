'use client'

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from 'next-auth/react'
import { Sidebar } from '@/components/navigation/sidebar'

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 lg:ml-64 transition-all duration-300">
              <div className="max-w-4xl mx-auto px-4 py-8">
                {children}
              </div>
            </main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
