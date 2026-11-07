import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes';
import {ReactNode} from "react";
import {SWRProvider} from "@/components/SWRProvider";
privacyPageUrl: '/privacy'
const Providers = ({ children } : { children: ReactNode }) => {

  return <>
    <ClerkProvider
      appearance={{
        theme: dark,
        layout: {
          privacyPageUrl: '/privacy'
        },
      }}
    >
      <SWRProvider>
        {children}
      </SWRProvider>
    </ClerkProvider>
  </>
}

export default Providers;