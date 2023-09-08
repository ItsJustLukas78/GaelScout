import {BsCheckLg} from "react-icons/bs";
import React from "react";
import * as Checkbox from '@radix-ui/react-checkbox';


export default function CheckboxDiv({ children, checked, onCheckedChange } : { children: string, checked: boolean, onCheckedChange: (e: any) => void }) {
  return (
    <div className="flex flex-row mt-5 items-center">
      <Checkbox.Root
        className="flex min-h-[25px] min-w-[25px] items-center justify-center rounded-[4px] bg-white"
        name={children}
        onCheckedChange={onCheckedChange}
        checked={checked}
        id={children}
      >
        <Checkbox.Indicator className="bg-blue-500 min-h-[25px] min-w-[25px] rounded-[3px] flex items-center justify-center" >
          <BsCheckLg size={15} />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label className="pl-[15px] text-sm text-white min-h-full" htmlFor={children}>
        {children}
      </label>
    </div>
  )
}