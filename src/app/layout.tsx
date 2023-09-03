import './globals.css'
import { Analytics } from '@vercel/analytics/react';
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Providers from '@/components/Providers'
import type { Metadata } from 'next'
import React from "react";
import {Slide, ToastContainer} from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';


export const metadata: Metadata = {
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
    <html lang="en">
      <Providers>
        <body>
          <Navbar />
          <div className="w-full mt-20">
            {children}
            <Analytics />
          </div>
          {/*<Footer />*/}
          <ToastContainer
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
        </body>
      </Providers>
    </html>
  )
}
