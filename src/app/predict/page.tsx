'use client'
import CorneredButton from '@/components/CorneredButton'
import Image from 'next/image'
import * as Form from '@radix-ui/react-form';

export default function Teams() {
  return (
    <main>
      <div className="w-full flex flex-col my-44">
        <div className="h-auto items-center justify-center flex flex-row gap-20">
          <div className="items-left justify-center flex flex-col">
            <h1 className="text-6xl font-bold mb-10 text-red-600">
              Team One
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
              <Form.Field className="flex flex-col" name="teamNumber">
                <Form.Label>
                  Team Number
                </Form.Label>
                <Form.Control asChild>
                  <input className="p-3 h-8 text-black rounded-lg" />
                </Form.Control>
              </Form.Field>
            </Form.Root>
          </div>
          <div className="h-auto items-center justify-center flex flex-col">
            <div className="rounded-2xl bg-neutral-800 w-144 h-112 shadow-lg shadow-neutral-700 flex flex-col">

            </div>
          </div>
          <div className="h-auto items-left justify-center flex flex-col">
            <h1 className="text-6xl font-bold mb-10 text-blue-600">
              Team Two
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
              <Form.Field className="flex flex-col" name="teamNumber">
                <Form.Label>
                  Team Number
                </Form.Label>
                <Form.Control asChild>
                  <input className="p-3 h-8 text-black rounded-lg" />
                </Form.Control>
              </Form.Field>
            </Form.Root>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center mt-16">
          <CorneredButton>
            Predict
          </CorneredButton>
        </div>
      </div>
    </main>
  )
}
