"use client"
import React, {FormEvent} from "react";
import {ColorWheel} from '@newfrgmnt/harmony';
import { IoIosColorPalette } from "react-icons/io";
import {useGlobalStore} from "@/state/globalState";
import { useEffect, useRef } from "react";
import { FaLock } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";

// tab on top right that can be expanded to show color picker
export default function MyColorPicker() {
    const colorVariableValues = useGlobalStore(state => state.colorVariableValues);
    const setColorVariableValues = useGlobalStore(state => state.setColorVariableValues);

    const hasHydrated = useGlobalStore(state => state._hasHydrated);
    
    const colorInput = useRef<{x?: number, y?: number, hue: number, saturation: number, value: number}[]>([]);

    const harmony = useGlobalStore(state => state.harmony);
    const setHarmony = useGlobalStore(state => state.setHarmony);
    const customThemeEnabled = useGlobalStore(state => state.customThemeEnabled);
    const setCustomThemeEnabled = useGlobalStore(state => state.setCustomThemeEnabled);
    
    useEffect(() => {
      let delayed: NodeJS.Timeout;
      if (hasHydrated) {
        delayed = setTimeout(() => {
          setColorVariableValues({
            "--color-primary": {
              hue: Math.trunc(colorInput.current[0].hue),
              saturation: Math.trunc(colorInput.current[0].saturation * 100),
              value: Math.trunc((colorInput.current[0].value * 100) / 2)
            },
            "--color-primary-hover": {
              hue: colorInput.current[0].hue,
              saturation: Math.trunc(colorInput.current[0].saturation * 100),
              value: Math.trunc((colorInput.current[0].value * 100) / 2) + 20
            },
            "--color-secondary": {
              hue: colorInput.current[1].hue,
              saturation: Math.trunc(colorInput.current[1].saturation * 100),
              value: Math.trunc((colorInput.current[1].value * 100) / 2)
            },
            "--color-secondary-hover": {
              hue: colorInput.current[1].hue,
              saturation: Math.trunc(colorInput.current[1].saturation * 100),
              value: Math.trunc((colorInput.current[1].value * 100) / 2) + 20
            },
            "--color-tertiary": {
              hue: colorInput.current[2].hue,
              saturation: Math.trunc(colorInput.current[2].saturation * 100),
              value: Math.trunc((colorInput.current[2].value * 100) / 2)
            },
            "--color-tertiary-hover": {
              hue: colorInput.current[2].hue,
              saturation: Math.trunc(colorInput.current[2].saturation * 100),
              value: Math.trunc((colorInput.current[2].value * 100) / 2) + 20
            }
          });
        }, 500);
      }

      return () => {
        if (delayed) {
          clearTimeout(delayed);
        }
      }
    }, [colorInput.current]);

    const [expanded, setExpanded] = React.useState(false);

    return <>
      <div className="fixed top-[100px] right-0 z-50">
        <div className={`relative w-60 bg-neutral-700 transition-all duration-500 ${expanded ? "translate-x-0 h-48" : "translate-x-60 h-10"}`}>
          <div
            className={`flex flex-col items-center justify-center bg-gradient-to-r from-neutral-800 to-neutral-700 transition-all duration-500 w-9 ${expanded ? "h-48 rounded-l-xl" : "h-10 rounded-l-md"} p-1 absolute -left-9 cursor-pointer`}
            onClick={() => setExpanded(!expanded)}
          >
            <IoIosColorPalette className={`absolute text-neutral-100 h-4 w-4 top-3 transition-all duration-500 ${expanded ? "opacity-0" : "opacity-100"}`} />
            <IoIosArrowForward className={`absolute text-neutral-100 h-6 w-6 transition-all duration-500 ${expanded ? "opacity-100" : "opacity-0"}`} />
          </div>
          <div className={`pl-3 py-3 flex flex-col gap-2 [&>*]:transition-all [&>*]:duration-100 ${expanded ? "[&>*]:opacity-100" : "[&>*]:opacity-0"}`}>
            {hasHydrated ? <>
              <div className="flex items-center gap-2">
                <ColorWheel
                  harmony={harmony}
                  radius={60}
                  color={
                    {
                      hue: Math.trunc(colorVariableValues["--color-primary"].hue),
                      saturation: colorVariableValues["--color-primary"].saturation / 100,
                      value: (colorVariableValues["--color-primary"].value + 10) / 100
                    }
                  }
                  onChange={(colors: { x?: number, y?: number, hue: number; saturation: number; value: number }[] | FormEvent): void => {
                    if (colors instanceof Array) {
                      colorInput.current = colors
                    }
                  }}
                />
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={colorVariableValues["--color-primary"].hue}
                      onChange={(e) => setColorVariableValues({
                        "--color-primary": {
                          hue: Math.trunc(parseInt(e.target.value)),
                          saturation: colorVariableValues["--color-primary"].saturation,
                          value: colorVariableValues["--color-primary"].value
                        }
                      })}
                      className="w-14 text-xs text-neutral-100 font-semibold bg-neutral-800 border-neutral-900 border-2 p-0.5 rounded-md"
                    />
                    <label className="text-neutral-100 font-semibold">H</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={colorVariableValues["--color-primary"].saturation}
                      onChange={(e) => setColorVariableValues({
                        "--color-primary": {
                          hue: colorVariableValues["--color-primary"].hue,
                          saturation: Math.trunc(parseInt(e.target.value)),
                          value: colorVariableValues["--color-primary"].value
                        }
                      })}
                      className="w-14 text-xs text-neutral-100 font-semibold bg-neutral-800 border-neutral-900 border-2 p-0.5 rounded-md"
                    />
                    <label className="text-neutral-100 font-semibold">S</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative flex items-center gap-2">
                      <input
                        type="number"
                        value={colorVariableValues["--color-primary"].value}
                        disabled
                        className="w-14 text-xs text-neutral-100 font-semibold bg-neutral-800 border-neutral-900 border-2 p-0.5 rounded-md"
                      />
                      <FaLock className="text-neutral-100 h-3 w-3 absolute right-1 top-1.5" />
                    </div>
                    <label className="text-neutral-100 font-semibold">V</label>
                  </div>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <select
                  value={harmony}
                  onChange={(e) => setHarmony(e.target.value as "triad" | "tetradic" | "analogous" | "square")}
                  className="w-28 text-neutral-100 font-semibold bg-neutral-800 border-neutral-900 border-2 p-0.5 rounded-md"
                >
                  <option value="triad">Triad</option>
                  <option value="tetradic">Tetradic</option>
                  <option value="analogous">Analogous</option>
                  <option value="square">Square</option>
                </select>
                <label className="flex items-center gap-2 w-24">
                  <span className="pl-1 font-semibold text-sm sm:text-md xl:text-lg text-neutral-100">Enabled</span>
                  <input
                    type="checkbox"
                    className="h-5 w-5"
                    checked={customThemeEnabled}
                    onChange={(event) => setCustomThemeEnabled(event.target.checked)}
                  />
                </label>
              </div>
              {/* allow direct input of hsl values */}
            </>: null}
          </div>
        </div>
      </div>
    </>
}