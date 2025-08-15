'use client'
import CorneredButton from '@/components/CorneredButton'
import * as Form from '@radix-ui/react-form';
import * as Progress from '@radix-ui/react-progress';
import React, {useEffect, useState} from "react";
import { toast } from "react-toastify";
import { rating, predictWin } from 'openskill'
import * as tf from '@tensorflow/tfjs';

export default function Teams() {
  const [model, setModel] = useState< any >(null);

  useEffect(() => {
    async function loadModel() {
      const model = await tf.loadLayersModel('/predictionModel/model.json');
      setModel(model);
    }

    loadModel();
  }, []);

  const [r1Team, setR1Team] = useState< string | null >(null);
  const [r2Team, setR2Team] = useState< string | null >(null);
  const [b1Team, setB1Team] = useState< string | null >(null);
  const [b2Team, setB2Team] = useState< string | null >(null);

  const [seasonId, setSeasonId] = useState<number>(197);

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

    searchParams.append('teamNumber[]', r1Team.toUpperCase());
    searchParams.append('teamNumber[]', r2Team.toUpperCase());
    searchParams.append('teamNumber[]', b1Team.toUpperCase());
    searchParams.append('teamNumber[]', b2Team.toUpperCase());

    try {
      const response = await fetch(`/api/seasons/${seasonId}/seasonProfiles/?${searchParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }

      const teams = data.data;

      const r1TeamData = teams.find((team: any) => team.teamNumber === r1Team.toUpperCase());
      const r2TeamData = teams.find((team: any) => team.teamNumber === r2Team.toUpperCase());
      const b1TeamData = teams.find((team: any) => team.teamNumber === b1Team.toUpperCase());
      const b2TeamData = teams.find((team: any) => team.teamNumber === b2Team.toUpperCase());

      const rRatings = [r1TeamData, r2TeamData].map(t => (rating({
        mu: t.opr,
        sigma: t.sigma
      })));

      const bRatings = [b1TeamData, b2TeamData].map(t => (rating({
        mu: t.opr,
        sigma: t.sigma
      })));

      const prediction = predictWin([rRatings, bRatings]);

      const rChance = Math.round(prediction[0] * 100);
      const bChance = Math.round(prediction[1] * 100);

      let red_opr = 0;
      let red_dpr = 0;
      let red_ccwm = 0;
      let red_openSkill = 0;
      let blue_opr = 0;
      let blue_dpr = 0;
      let blue_ccwm = 0;
      let blue_openSkill = 0;

      red_opr = Math.round((r1TeamData.opr + r2TeamData.opr) * 10000) / 10000;
      red_dpr = Math.round((r1TeamData.dpr + r2TeamData.dpr) * 10000) / 10000;
      red_ccwm = Math.round((r1TeamData.ccwm + r2TeamData.ccwm) * 10000) / 10000;
      red_openSkill = Math.round((r1TeamData.openSkill + r2TeamData.openSkill) * 10000) / 10000;

      blue_opr = Math.round((b1TeamData.opr + b2TeamData.opr) * 10000) / 10000;
      blue_dpr = Math.round((b1TeamData.dpr + b2TeamData.dpr) * 10000) / 10000;
      blue_ccwm = Math.round((b1TeamData.ccwm + b2TeamData.ccwm) * 10000) / 10000;
      blue_openSkill = Math.round((b1TeamData.openSkill + b2TeamData.openSkill) * 10000) / 10000;

      const resultTensor: any = model.predict(tf.tensor2d([red_opr, red_dpr, red_ccwm, red_openSkill, blue_opr, blue_dpr, blue_ccwm, blue_openSkill], [1, 8]));
      let predictedValue: number = resultTensor.arraySync()[0][0];

      predictedValue = Math.round(predictedValue * 100);

      let rChance2 = 0;
      let bChance2 = 0;

      rChance2 = predictedValue
      bChance2 = 100 - predictedValue

      setPrediction({
        rChance,
        bChance,
        rChance2,
        bChance2
      });

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
        className="py-32"
        onSubmit={predictMatch}
      >
        <div className="flex h-auto flex-row justify-center gap-7 sm:gap-11 md:gap-20 xl:mt-0">
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
              <option value="190">High Stakes 2024-25</option>
              <option value="197">Push Back 2025-26</option>
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
              <div className="flex h-60 w-64 flex-col items-center gap-5 rounded-2xl p-5 shadow-lg shadow-neutral-700 bgColorPrimary sm:w-144 sm:h-72 sm:p-10">
                <div className="flex flex-col items-center">
                  <div className="flex flex-row items-center justify-center gap-20 sm:gap-44">
                    <div className="flex flex-col items-center justify-center">
                      <h1 className="text-xl font-bold text-red-600 sm:text-2xl">
                        {redChance}%
                      </h1>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <h1 className="text-xl font-bold text-blue-600 sm:text-2xl">
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
                        className="bg-red-600 w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.65, 0, 0.35, 1)]"
                        style={{ transform: `translateX(-${100 - progress}%)` }}
                      />
                    </Progress.Root>
                  </div>
                  <h1 className="text-xs font-bold outlinedText sm:text-sm">
                    OpenSkill Prediction
                  </h1>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex flex-row items-center justify-center gap-20 sm:gap-44">
                    <div className="flex flex-col items-center justify-center">
                      <h1 className="text-xl font-bold text-red-600 sm:text-2xl">
                        {redChance2}%
                      </h1>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <h1 className="text-xl font-bold text-blue-600 sm:text-2xl">
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
                        className="bg-red-600 w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.65, 0, 0.35, 1)]"
                        style={{ transform: `translateX(-${100 - progress2}%)` }}
                      />
                    </Progress.Root>
                  </div>
                  <h1 className="text-center text-xs font-bold outlinedText sm:text-sm">
                    Model trained using OpenSkill, OPR, DPR, and CCWM
                  </h1>
                  <h1 className="font-bold text-2xs outlinedText sm:text-xs">
                    Not good with outlying scenarios
                  </h1>
                  <h1 className="font-bold text-2xs outlinedText sm:text-xs">
                    85% accuracy otherwise
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
                <option value="190">High Stakes 2024-25</option>
                <option value="197">Push Back 2025-26</option>
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

