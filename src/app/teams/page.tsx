'use client'
import CorneredButton from '@/components/CorneredButton'
import Image from 'next/image'
import * as Form from '@radix-ui/react-form';

export default function Teams() {
  return (
    <main>
      <div className="w-full items-center justify-center flex flex-row my-44 gap-20">
        <div className="h-auto items-left justify-center flex flex-col">
          <h1 className="text-8xl font-bold mb-10">
            Teams
          </h1>
          <Form.Root className="gap-5 flex flex-col">
            <Form.Field className="flex flex-col" name="teamNumber">
              <Form.Label>
                Team Number
              </Form.Label>
              <Form.Control asChild>
                <input className="p-3 h-8 text-black rounded-lg" />
              </Form.Control>
            </Form.Field>
            <Form.Field className="flex flex-col gap-2" name="country">
              <Form.Label>
                Country/Region
              </Form.Label>
              <Form.Control asChild>
                <input className="p-3 h-8 text-black rounded-lg" />
              </Form.Control>
              <Form.Field className="flex flex-col" name="region">
                <Form.Control asChild>
                  <input className="p-3 h-8 text-black rounded-lg" />
                </Form.Control>
              </Form.Field>
            </Form.Field>
            <Form.Field className="flex flex-col" name="gradeLevel">
              <Form.Label>
                Grade Level
              </Form.Label>
              <Form.Control asChild>
                <input className="p-3 h-8 text-black rounded-lg" />
              </Form.Control>
            </Form.Field>
            <Form.Field className="flex flex-col" name="teamNumber">
              <Form.Label>
                Event SKU
              </Form.Label>
              <Form.Control asChild>
                <input className="p-3 h-8 text-black rounded-lg" />
              </Form.Control>
            </Form.Field>
            <Form.Submit asChild>
              <CorneredButton>Search</CorneredButton>
            </Form.Submit>
          </Form.Root>
        </div>
        <div className="h-auto items-center justify-center flex">
          <div className="rounded-2xl bg-neutral-800 w-144 h-112 shadow-lg shadow-neutral-700">

          </div>
        </div>
      </div>
    </main>
  )
}
