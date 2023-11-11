'use client'
import CorneredButton from '@/components/CorneredButton'
import * as Form from '@radix-ui/react-form';
import * as Progress from '@radix-ui/react-progress';
import React, {useEffect, useState} from "react";
import { toast } from "react-toastify";

export default function Teams() {
  const [r1Team, setR1Team] = useState< string | null >(null);
  const [r2Team, setR2Team] = useState< string | null >(null);
  const [b1Team, setB1Team] = useState< string | null >(null);
  const [b2Team, setB2Team] = useState< string | null >(null);

  const [seasonId, setSeasonId] = useState<number>(181);

  const [prediction, setPrediction] = useState< any >(null);

  const [progress, setProgress] = useState< number >(50);

  const [redChance, setRedChance] = useState< number >(0);
  const [blueChance, setBlueChance] = useState< number >(0);

  const [progress2, setProgress2] = useState< number >(50);

  const [redChance2, setRedChance2] = useState< number >(0);
  const [blueChance2, setBlueChance2] = useState< number >(0);

  const [allInputsProvided, setAllInputsProvided] = useState< boolean >(false);

  useEffect(() => {
    if (prediction === null) {
      setProgress(50);
      setRedChance(0);
      setBlueChance(0);

      setProgress2(50);
      setRedChance2(0);
      setBlueChance2(0);
    } else {
      setProgress(prediction.rChance)
      setRedChance(prediction.rChance)
      setBlueChance(prediction.bChance)

      setProgress2(prediction.rChance2)
      setRedChance2(prediction.rChance2)
      setBlueChance2(prediction.bChance2)
    }

    return () => {
      setProgress(50);
      setRedChance(0);
      setBlueChance(0);

      setProgress2(50);
      setRedChance2(0);
      setBlueChance2(0);
    }
  }, [prediction]);

  const predictMatch = async(event: any) => {
    event.preventDefault();

    if (!r1Team || !r2Team || !b1Team || !b2Team) {
      alert("Please fill out all team numbers");
      return;
    }

    toast.info("Predicting match...");

    const searchParams = new URLSearchParams();

    searchParams.append('r1Team', r1Team.toUpperCase());
    searchParams.append('r2Team', r2Team.toUpperCase());
    searchParams.append('b1Team', b1Team.toUpperCase());
    searchParams.append('b2Team', b2Team.toUpperCase());
    searchParams.append('seasonId', String(seasonId));

    try {
      const response = await fetch(`/api/predict?${searchParams.toString()}`);

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }
      setPrediction(data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (r1Team && r2Team && b1Team && b2Team) {
      setAllInputsProvided(true);
    } else {
      setAllInputsProvided(false);
    }
  }, [r1Team, r2Team, b1Team, b2Team]);


  return (
    <main>
      <Form.Root
        onSubmit={predictMatch}
      >
        <div className="mt-32 flex h-auto flex-row justify-center gap-7 sm:gap-11 md:gap-20 xl:mt-0">
          <div className="flex flex-col justify-center items-left xl:hidden">
            <h1 className="mb-10 text-center text-3xl font-bold text-red-600 sm:text-5xl">
              Team One
            </h1>
            <div className="flex flex-col items-center gap-5">
              <Form.Field className="flex flex-col" name="r1Team">
                <Form.Label>
                  Team Number
                </Form.Label>
                <Form.Control asChild>
                  <input
                    className="h-8 w-36 rounded-lg p-3 text-black sm:w-full"
                    required
                    value={r1Team || ""}
                    onChange={(event) => setR1Team(event.target.value)}
                  />
                </Form.Control>
              </Form.Field>
              <Form.Field className="flex flex-col" name="r2Team">
                <Form.Label>
                  Team Number
                </Form.Label>
                <Form.Control asChild>
                  <input
                    className="h-8 w-36 rounded-lg p-3 text-black sm:w-full"
                    required
                    value={r2Team || ""}
                    onChange={(event) => setR2Team(event.target.value)}
                  />
                </Form.Control>
              </Form.Field>
            </div>
          </div>
          <div className="flex h-auto flex-col justify-center items-left xl:hidden">
            <h1 className="mb-10 text-center text-3xl font-bold text-blue-600 sm:text-5xl">
              Team Two
            </h1>
            <div className="flex flex-col items-center gap-5">
              <Form.Field className="flex flex-col" name="b1Team">
                <Form.Label>
                  Team Number
                </Form.Label>
                <Form.Control asChild>
                  <input
                    className="h-8 w-36 rounded-lg p-3 text-black sm:w-full"
                    required
                    value={b1Team || ""}
                    onChange={(event) => setB1Team(event.target.value)}
                  />
                </Form.Control>
              </Form.Field>
              <Form.Field className="flex flex-col" name="b2Team">
                <Form.Label>
                  Team Number
                </Form.Label>
                <Form.Control asChild>
                  <input
                    className="h-8 w-36 rounded-lg p-3 text-black sm:w-full"
                    required
                    value={b2Team || ""}
                    onChange={(event) => setB2Team(event.target.value)}
                  />
                </Form.Control>
              </Form.Field>
            </div>
          </div>
        </div>
        <div className="my-10 flex flex-col items-center justify-center gap-10 sm:flex-row xl:hidden">
          <Form.Field className="flex flex-col" name="seasonId">
            <Form.Label>
              Season
            </Form.Label>
            <select
              className="h-15 w-36 rounded-lg p-3 text-black sm:w-full"
              required
              value={seasonId}
              onChange={(event) => setSeasonId(parseInt(event.target.value))}
            >
              <option value="173">Spin Up 2022-23</option>
              <option value="181">Over Under 2023-24</option>
            </select>
          </Form.Field>
          <Form.Submit asChild>
            <CorneredButton className={`sm:mt-5 ${allInputsProvided ? "" : "bg-gray-500"}`} disabled={!allInputsProvided}>
              Predict
            </CorneredButton>
          </Form.Submit>
        </div>
        <div className="flex w-full flex-col lg:my-14 xl:my-44">
          <div className="flex h-auto flex-row items-center justify-center gap-20">
            <div className="hidden flex-col justify-center items-left xl:flex">
              <h1 className="mb-10 text-5xl font-bold text-red-600">
                Team One
              </h1>
              <div className="flex flex-col gap-5">
                <Form.Field className="flex flex-col" name="r1Team">
                  <Form.Label>
                    Team Number
                  </Form.Label>
                  <Form.Control asChild>
                    <input
                      className="h-8 rounded-lg p-3 text-black"
                      required
                      value={r1Team || ""}
                      onChange={(event) => setR1Team(event.target.value)}
                    />
                  </Form.Control>
                </Form.Field>
                <Form.Field className="flex flex-col" name="r2Team">
                  <Form.Label>
                    Team Number
                  </Form.Label>
                  <Form.Control asChild>
                    <input
                      className="h-8 rounded-lg p-3 text-black"
                      required
                      value={r2Team || ""}
                      onChange={(event) => setR2Team(event.target.value)}
                    />
                  </Form.Control>
                </Form.Field>
              </div>
            </div>
            <div className="flex h-auto flex-col items-center justify-center">
              <div className="p-10 flex h-40 w-64 flex-col justify-between items-center rounded-2xl bg-neutral-800 shadow-lg shadow-neutral-700 sm:w-144 sm:h-64">
                <div className="flex flex-col items-center">
                  <div className="flex flex-row items-center justify-center gap-20 sm:gap-44">
                    <div className="flex flex-col items-center justify-center">
                      <h1 className="text-4xl font-bold text-red-600 sm:text-2xl">
                        {redChance}%
                      </h1>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <h1 className="text-4xl font-bold text-blue-600 sm:text-2xl">
                        {blueChance}%
                      </h1>
                    </div>
                  </div>
                  <div className="flex flex-row items-center justify-center gap-72">
                    <Progress.Root
                      className="relative overflow-hidden rounded-full bg-blue-600 w-[200px] h-[15px] sm:w-[400px] sm:h-[25px]"
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
                  <h1 className="text-sm font-bold text-neutral-400 sm:text-sm">
                    Considered: match history
                  </h1>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex flex-row items-center justify-center gap-20 sm:gap-44">
                    <div className="flex flex-col items-center justify-center">
                      <h1 className="text-4xl font-bold text-red-600 sm:text-2xl">
                        {redChance2}%
                      </h1>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <h1 className="text-4xl font-bold text-blue-600 sm:text-2xl">
                        {blueChance2}%
                      </h1>
                    </div>
                  </div>
                  <div className="flex flex-row items-center justify-center gap-72">
                    <Progress.Root
                      className="relative overflow-hidden rounded-full bg-blue-600 w-[200px] h-[15px] sm:w-[400px] sm:h-[25px]"
                      style={{
                        // Fix overflow clipping in Safari
                        // https://gist.github.com/domske/b66047671c780a238b51c51ffde8d3a0
                        transform: 'translateZ(0)',
                      }}
                      value={progress2}
                    >
                      <Progress.Indicator
                        className="bg-red-600 w-full h-full transition-transform duration-[660ms] ease-[cubic-bezier(0.65, 0, 0.35, 1)]"
                        style={{ transform: `translateX(-${100 - progress2}%)` }}
                      />
                    </Progress.Root>
                  </div>
                  <h1 className="text-sm font-bold text-neutral-400 sm:text-sm">
                    Considered: match history, OPR, DPR, and CCWM
                  </h1>
                </div>
              </div>
            </div>
            <div className="hidden h-auto flex-col justify-center items-left xl:flex">
              <h1 className="mb-10 text-5xl font-bold text-blue-600">
                Team Two
              </h1>
              <div className="flex flex-col gap-5">
                <Form.Field className="flex flex-col" name="b1Team">
                  <Form.Label>
                    Team Number
                  </Form.Label>
                  <Form.Control asChild>
                    <input
                      className="h-8 rounded-lg p-3 text-black"
                      required
                      value={b1Team || ""}
                      onChange={(event) => setB1Team(event.target.value)}
                    />
                  </Form.Control>
                </Form.Field>
                <Form.Field className="flex flex-col" name="b2Team">
                  <Form.Label>
                    Team Number
                  </Form.Label>
                  <Form.Control asChild>
                    <input
                      className="h-8 rounded-lg p-3 text-black"
                      required
                      value={b2Team || ""}
                      onChange={(event) => setB2Team(event.target.value)}
                    />
                  </Form.Control>
                </Form.Field>
              </div>
            </div>
          </div>
          <div className="mt-16 hidden flex-col items-center justify-center gap-10 xl:flex">
            <Form.Field className="flex flex-col" name="seasonId">
              <Form.Label>
                Season
              </Form.Label>
              <select
                className="h-15 rounded-lg p-3 text-black"
                required
                value={seasonId}
                onChange={(event) => setSeasonId(parseInt(event.target.value))}
              >
                <option value="173">Spin Up 2022-23</option>
                <option value="181">Over Under 2023-24</option>
              </select>
            </Form.Field>
            <Form.Submit asChild>
              <CorneredButton className={`sm:mt-5 disabled:bg-gray-500`} disabled={!allInputsProvided}>
                Predict
              </CorneredButton>
            </Form.Submit>
          </div>
        </div>
      </Form.Root>
    </main>
  )
}

