import {BsCheckLg} from "react-icons/bs";
import React from "react";
import * as Checkbox from '@radix-ui/react-checkbox';


export default function CheckboxDiv({ children, checked, onCheckedChange } : { children: string, checked: boolean, onCheckedChange: (e: any) => void }) {
  return (
    <div className="mt-5 flex flex-row items-center">
      <Checkbox.Root
        className="flex items-center justify-center bg-white min-h-[25px] min-w-[25px] rounded-[4px]"
        name={children}
        onCheckedChange={onCheckedChange}
        checked={checked}
        id={children}
      >
        <Checkbox.Indicator className="flex items-center justify-center bg-blue-500 min-h-[25px] min-w-[25px] rounded-[3px]" >
          <BsCheckLg size={15} />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <label className="min-h-full text-sm text-white pl-[15px]" htmlFor={children}>
        {children}
      </label>
    </div>
  )
}