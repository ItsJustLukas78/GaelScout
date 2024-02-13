import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes';
import {ReactNode} from "react";
import {SWRProvider} from "@/components/SWRProvider";

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
      <SWRProvider>
        {children}
      </SWRProvider>
    </ClerkProvider>
  )
}

export default Providers;