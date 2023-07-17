'use client'
import CorneredButton from '@/components/CorneredButton'
import Image from 'next/image'
import * as Form from '@radix-ui/react-form';
import * as Progress from '@radix-ui/react-progress';
import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";

export default function Teams() {
  const [r1Team, setR1Team] = useState< string | null >(null);
  const [r2Team, setR2Team] = useState< string | null >(null);
  const [b1Team, setB1Team] = useState< string | null >(null);
  const [b2Team, setB2Team] = useState< string | null >(null);

  const [seasonId, setSeasonId] = useState< number >(173);

  const [prediction, setPrediction] = useState< any >(null);

  const [progress, setProgress] = useState< number >(50);

  const [redChance, setRedChance] = useState< number >(0);
  const [blueChance, setBlueChance] = useState< number >(0);

  useEffect(() => {
    if (prediction === null) {
      setProgress(50);
      setRedChance(0);
      setBlueChance(0);
    } else {
      setProgress(prediction.rChance)
      setRedChance(prediction.rChance)
      setBlueChance(prediction.bChance)
    }

    return () => {
      setProgress(50);
      setRedChance(0);
      setBlueChance(0);
    }
  }, [prediction]);

  const predictMatch = (event: any) => {
    event.preventDefault();

    console.log(r1Team, r2Team, b1Team, b2Team);

    if (r1Team === null || r2Team === null || b1Team === null || b2Team === null) {
      alert("Please fill out all team numbers");
      return;
    }

    const searchParams = new URLSearchParams();

    searchParams.append('r1Team', r1Team);
    searchParams.append('r2Team', r2Team);
    searchParams.append('b1Team', b1Team);
    searchParams.append('b2Team', b2Team);
    searchParams.append('seasonId', String(seasonId));

    fetch(`/api/predict?${searchParams.toString()}`).then((response) => {
      response.json().then((data) => {
        setPrediction(data);
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  return (
    <main>
      <Form.Root
        onSubmit={predictMatch}
      >
        <div className="w-full flex flex-col my-44">
          <div className="h-auto items-center justify-center flex flex-row gap-20">
            <div className="items-left justify-center flex flex-col">
              <h1 className="text-6xl font-bold mb-10 text-red-600">
                Team One
              </h1>
              <div className="gap-5 flex flex-col">
                <Form.Field className="flex flex-col" name="r1Team">
                  <Form.Label>
                    Team Number
                  </Form.Label>
                  <Form.Control asChild>
                    <input
                      className="p-3 h-8 text-black rounded-lg"
                      required
                      onChange={(event) => setR1Team(event.target.value)}
                    />
                  </Form.Control>
                  <Form.Message className="text-red-600 text-sm" match="valueMissing">
                    Please enter a team number
                  </Form.Message>
                </Form.Field>
                <Form.Field className="flex flex-col" name="r2Team">
                  <Form.Label>
                    Team Number
                  </Form.Label>
                  <Form.Control asChild>
                    <input
                      className="p-3 h-8 text-black rounded-lg"
                      required
                      onChange={(event) => setR2Team(event.target.value)}
                    />
                  </Form.Control>
                  <Form.Message className="text-red-600 text-sm" match="valueMissing">
                    Please enter a team number
                  </Form.Message>
                </Form.Field>
              </div>
            </div>
            <div className="h-auto items-center justify-center flex flex-col">
              <div className="rounded-2xl bg-neutral-800 w-144 h-72 shadow-lg shadow-neutral-700 flex flex-col">
                <div className="flex flex-row justify-center items-center gap-44 mb-auto mt-20">
                  <div className="flex flex-col justify-center items-center">
                    <h1 className="text-red-600 text-6xl font-bold">
                      {redChance}%
                    </h1>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <h1 className="text-blue-600 text-6xl font-bold">
                      {blueChance}%
                    </h1>
                  </div>
                </div>
                <div className="flex flex-row justify-center items-center gap-72 mb-auto mt-5">
                  <Progress.Root
                    className="relative overflow-hidden bg-blue-600 rounded-full w-[400px] h-[25px]"
                    style={{
                      // Fix overflow clipping in Safari
                      // https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0
                      transform: 'translateZ(0)',
                    }}
                    value={progress}
                  >
                    <Progress.Indicator
                      className="bg-red-600 w-full h-full transition-transform duration-[660ms] ease-[cubic-bezier(0.65, 0, 0.35, 1)]"
                      style={{ transform: `translateX(-${100 - progress}%)` }}
                    />
                  </Progress.Root>
                </div>
              </div>
            </div>
            <div className="h-auto items-left justify-center flex flex-col">
              <h1 className="text-6xl font-bold mb-10 text-blue-600">
                Team Two
              </h1>
              <div className="gap-5 flex flex-col">
                <Form.Field className="flex flex-col" name="b1Team">
                  <Form.Label>
                    Team Number
                  </Form.Label>
                  <Form.Control asChild>
                    <input
                      className="p-3 h-8 text-black rounded-lg"
                      required
                      onChange={(event) => setB1Team(event.target.value)}
                    />
                  </Form.Control>
                  <Form.Message className="text-red-600 text-sm" match="valueMissing">
                    Please enter a team number
                  </Form.Message>
                </Form.Field>
                <Form.Field className="flex flex-col" name="b2Team">
                  <Form.Label>
                    Team Number
                  </Form.Label>
                  <Form.Control asChild>
                    <input
                      className="p-3 h-8 text-black rounded-lg"
                      required
                      onChange={(event) => setB2Team(event.target.value)}
                    />
                  </Form.Control>
                  <Form.Message className="text-red-600 text-sm" match="valueMissing">
                    Please enter a team number
                  </Form.Message>
                </Form.Field>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center mt-16 gap-10">
            <Form.Field className="flex flex-col" name="seasonId">
              <Form.Label>
                Season
              </Form.Label>
              <Form.Control asChild>
                <select
                  className="p-3 h-15 text-black rounded-lg"
                  required
                  onChange={(event) => setSeasonId(parseInt(event.target.value))}
                >
                  <option value="173">Spin Up 2022-2023</option>
                  <option value="181">Over Under 2023-2024</option>
                </select>
              </Form.Control>
              <Form.Message className="text-red-600 text-sm" match="valueMissing">
                Please select a season
              </Form.Message>
            </Form.Field>
            <Form.Submit asChild>
              <CorneredButton>
                Predict
              </CorneredButton>
            </Form.Submit>
          </div>
        </div>
      </Form.Root>
    </main>
  )
}

