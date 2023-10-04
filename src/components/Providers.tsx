import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes';
import {ReactNode} from "react";

const Providers = ({ children } : { children: ReactNode }) => {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        layout: {
          privacyPageUrl: '/privacy'
        },
      }}
    >
      {children}
    </ClerkProvider>
  )
}

export default Providers;