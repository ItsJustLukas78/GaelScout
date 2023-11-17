import './globals.css'
import { Analytics } from '@vercel/analytics/react';
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Providers from '@/components/Providers'
import type { Metadata } from 'next'
import React from "react";
import { Slide, ToastContainer } from "react-toastify";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import QuickSearch from "@/components/QuickSearch";
import { GeistSans } from 'geist/font/sans';
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  manifest: 'https://gaelscout.com/manifest.json',
  title: 'GaelScout',
  description: 'Scouting for VRC made easy',
  appleWebApp: {
    title: 'GaelScout',
    statusBarStyle: 'black',
    startupImage: [
      '/public/iphone14portrait.png',
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <Providers>
        <body className="relative min-h-screen">
          {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS ? (
            <GoogleAnalytics ga_id=
            {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS} />
          ) : null}
          <Navbar />
          <div className="flex w-full justify-center">
            <QuickSearch />
            {children}
            <Analytics />
          </div>
          <ToastContainer
            className="!scale-90"
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            transition={Slide}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          <Footer />
        </body>
      </Providers>
    </html>
  )
}
