import './globals.css'
import { Analytics } from '@vercel/analytics/react';
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Providers from '@/components/Providers'
import type { Metadata } from 'next'
import React from "react";

export const metadata: Metadata = {
  title: 'GaelScout',
  description: 'Scouting for VRC made easy',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <div className="w-full mt-20">
            {children}
            <Analytics />
          </div>
          {/*<Footer />*/}
        </Providers>
      </body>
    </html>
  )
}
