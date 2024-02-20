'use client';
import {useGlobalStore} from "@/state/globalState";
import {useEffect} from "react";


export default function ColorProvider({ children } : { children: React.ReactNode }) {
  const colorVariableValues = useGlobalStore(state => state.colorVariableValues);
  const hasHydrated = useGlobalStore(state => state._hasHydrated);

  const customThemeEnabled = useGlobalStore(state => state.customThemeEnabled);

  useEffect(() => {
    if (hasHydrated && customThemeEnabled) {
      const root = document.documentElement;
      Object.entries(colorVariableValues).forEach(([key, value]) => {
        root.style.setProperty(key, `hsl(${value.hue}, ${value.saturation}%, ${value.value}%)`);
      });
    } else if (hasHydrated) {
      const root = document.documentElement;
      root.style.setProperty("--color-primary", `hsl(0, 0%, 14.9%)`);
      root.style.setProperty("--color-primary-hover", `hsl(0, 0%, 32.2%)`);
      root.style.setProperty("--color-secondary", `hsl(0, 0%, 25.1%)`);
      root.style.setProperty("--color-secondary-hover", `hsl(0, 0%, 32.2%)`);
      root.style.setProperty("--color-tertiary", `hsl(0, 0%, 100%)`);
      root.style.setProperty("--color-tertiary-hover", `hsl(25.5, 3.9%, 66.3%)`);
    }
  }, [hasHydrated, colorVariableValues, customThemeEnabled]);


  return (
    <div>
      {children}
    </div>
  )
};