import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes';
import {ReactNode} from "react";

const Providers = ({ children } : { children: ReactNode }) => {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      {children}
    </ClerkProvider>
  )
}

export default Providers;