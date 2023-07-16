import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
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
        <Navbar />
        <div className="w-full mt-20">
          {children}
        </div>
        {/*<Footer />*/}
      </body>
    </html>
  )
}
