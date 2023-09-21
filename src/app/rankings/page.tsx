"use client"
import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import { Event, TeamProfile, TeamSeasonProfile, RankableStatistic } from "@/app/types";
import {AiOutlineDoubleLeft, AiOutlineDoubleRight, AiOutlineLeft, AiOutlineRight} from "react-icons/ai";

export default function RankingsPage() {

  const [loadingTeams, setLoadingTeams] = useState(true);
  const [rankedStatistic, setRankedStatistic] = useState<RankableStatistic>(RankableStatistic.OPENSKILL);
  const [seasonId, setSeasonId] = useState<number>(181);
  const [topRatedTeams, setTopRatedTeams] = useState<TeamSeasonProfile[]>([]);
  const [currentResultsCount, setCurrentResultsCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getRankedTeams = (event: any, page?: number) => {
    if (event) {
      event.preventDefault();
    }

    setLoadingTeams(true);
    setTopRatedTeams([]);

    if (!page) {
      page = 1;
      setCurrentPage(1);
    } else {
      setCurrentPage(page);
    }

    const searchParams = new URLSearchParams();
    searchParams.append("sort", rankedStatistic);
    searchParams.append("perPage", "50");
    searchParams.append("page", page ? page.toString() : "1");

    fetch(`/api/seasons/${seasonId}/seasonProfiles?${searchParams.toString()}`).then((response) => {
      response.json().then((data) => {
        if (data.error) {
          toast.error(data.error);
          setTopRatedTeams([]);
          setLoadingTeams(false);
          setCurrentResultsCount(0);
          setTotalPages(0);
          return;
        }

        const meta = data.meta;
        const totalResults = meta.total;
        const results = data.data;
        const resultCount = results.length;

        if (resultCount === 0) {
          toast.info("No teams found");
          setTopRatedTeams([]);
          setCurrentResultsCount(0);
          setTotalPages(0);
        } else {
          setTopRatedTeams(results);
          setCurrentResultsCount(resultCount);
          setTotalPages(Math.ceil(totalResults / 100));
          setLoadingTeams(false);
        }

        setLoadingTeams(false);
      });
    }).catch((error) => {
      toast.error(error);
      setTopRatedTeams([]);
      setLoadingTeams(false);
      setCurrentResultsCount(0);
      setTotalPages(0);
    });
  }

  useEffect(() => {
    getRankedTeams(null, 1);
  }, [rankedStatistic, seasonId]);

  return (
    <main>
      <div className="my-44 flex w-full flex-col items-center justify-center">
        <div className="flex h-auto flex-col justify-center rounded-2xl bg-neutral-800 p-8 items-left max-w-[340px] sm:min-w-[500px] md:min-w-[700px] lg:min-w-[900px] xl:min-w-[1200px]">
          <div className="mb-10 flex flex-col justify-between lg:flex-row">
            <h3 className="my-5 min-w-fit text-3xl font-bold xs:text-5xl lg:my-0">
              Rankings
            </h3>
            <div className="flex sm:flex-row flex-col gap-4">
              <select
                className="sm:h-12 h-10 sm:w-52 xl:w-48 rounded-lg p-3 text-black sm:text-sm text-xs"
                required
                value={rankedStatistic}
                onChange={(event) => setRankedStatistic(event.target.value as RankableStatistic)}
              >
                <option value="opr">OPR</option>
                <option value="dpr">DPR</option>
                <option value="ccwm">CCWM</option>
                <option value="openSkill">OpenSkill</option>
                <option value="topTotalSkills">World Skills</option>
              </select>
              <select
                className="sm:h-12 h-10 sm:w-52 xl:w-48 rounded-lg p-3 text-black sm:text-sm text-xs"
                required
                value={seasonId}
                onChange={(event) => setSeasonId(parseInt(event.target.value))}
              >
                <option value="173">Spin Up 2022-2023</option>
                <option value="181">Over Under 2023-2024</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-4 overflow-auto w-[100%]">
            <table className="table-auto border-separate rounded-2xl min-w-[100%]">
              <thead>
                <tr className="[&>th]:text-xs sm:[&>th]:text-sm md:[&>th]:text-md xl:[&>th]:text-xl [&>th]:pb-5 [&>th]:pl-4 [&>th]:text-left">
                  <th>Number</th>
                  <th>OPR</th>
                  <th>DPR</th>
                  <th>CCWM</th>
                  <th>OpenSkill</th>
                  <th>WorldSkills</th>
                </tr>
              </thead>
              <tbody className="rounded-2xl bg-neutral-700">
                {topRatedTeams.length !== 0 ? topRatedTeams.map((result: TeamSeasonProfile) => {
                  return (
                    <tr key={result.teamNumber}>
                      <td className="px-4 py-2 text-sm font-semibold md:text-lg xl:text-2xl">
                        <a href={`/teams/${result.teamNumber}`} className="hover:text-blue-500">{result.teamNumber}</a>
                      </td>
                      <td className="px-4 py-2 text-xs md:text-lg xl:text-xl">{result.opr}</td>
                      <td className="px-4 py-2 text-xs md:text-lg xl:text-xl">{result.dpr}</td>
                      <td className="px-4 py-2 text-xs md:text-lg xl:text-xl">{result.ccwm}</td>
                      <td className="px-4 py-2 text-xs md:text-lg xl:text-xl">{result.openSkill}</td>
                      <td className="px-4 py-2 text-xs md:text-lg xl:text-xl">{result.topTotalSkills}</td>
                    </tr>
                  )
                }) : loadingTeams ?
                  [0,1,2,3,4].map(() => {
                    return (
                      <tr className="animate-pulse h-16" key={Math.random()}>
                        <td className="px-4 py-2 text-sm font-semibold md:text-lg xl:text-2xl bg-gray-400"></td>
                        <td className="px-4 py-2 text-xs xs:text-sm md:text-lg xl:text-xl bg-gray-400"></td>
                        <td className="px-4 py-2 text-xs xs:text-sm md:text-lg xl:text-xl bg-gray-400"></td>
                        <td className="px-4 py-2 text-xs xs:text-sm md:text-lg xl:text-xl bg-gray-400"></td>
                        <td className="px-4 py-2 text-xs xs:text-sm md:text-lg xl:text-xl bg-gray-400"></td>
                        <td className="px-4 py-2 text-xs xs:text-sm md:text-lg xl:text-xl bg-gray-400"></td>
                      </tr>
                    )
                  }) : null}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-4 flex flex-row">
          <h3 className="mr-4 flex items-center text-sm text-white">
            {currentResultsCount} Results
          </h3>
          <button
            className="h-8 rounded-l-md bg-white p-1 text-black min-w-[20px]"
            onClick={() => getRankedTeams(null, 1)}
            disabled={currentPage === 1}
          >
            <AiOutlineDoubleLeft />
          </button>
          <button
            className="h-8 bg-white p-1 text-black min-w-[20px]"
            onClick={() => getRankedTeams(null, currentPage - 1)}
            disabled={currentPage === 1}
          >
            <AiOutlineLeft />
          </button>
          <div className="flex flex-row">
            {totalPages === 1 &&
              <>
                <button
                  className="h-8 bg-white p-1 text-black min-w-[20px]"
                  onClick={() => {}}
                  disabled={true}
                >
                  1
                </button>
              </>
            }
            {totalPages > 1 && <>
                {currentPage - 2 > 0 &&
                  <>
                    <button
                      className="h-8 bg-white p-1 text-black min-w-[20px]"
                      onClick={(e) => getRankedTeams(e, currentPage - 2)}
                    >
                      {currentPage - 2}
                    </button>
                  </>
                }
                {currentPage - 1 > 0 &&
                  <>
                    <button
                      className="h-8 bg-white p-1 text-black min-w-[20px]"
                      onClick={(e) => getRankedTeams(e, currentPage - 1)}
                    >
                      {currentPage - 1}
                    </button>
                  </>
                }
                <button
                  className="h-8 bg-neutral-400 p-1 text-black min-w-[20px]"
                  onClick={() => {}}
                  disabled={true}
                >
                  {currentPage}
                </button>
                {currentPage + 1 <= totalPages &&
                  <>
                    <button
                      className="h-8 bg-white p-1 text-black min-w-[20px]"
                      onClick={(e) =>  getRankedTeams(e, currentPage + 1)}
                    >
                      {currentPage + 1}
                    </button>
                  </>
                }
                {currentPage + 2 <= totalPages &&
                  <>
                    <button
                      className="h-8 bg-white p-1 text-black min-w-[20px]"
                      onClick={(e) => getRankedTeams(e, currentPage + 2)}
                    >
                      {currentPage + 2}
                    </button>
                  </>
                }
              </>
            }
          </div>
          <button
            className="h-8 bg-white p-1 text-black min-w-[20px]"
            onClick={() => getRankedTeams(null, currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <AiOutlineRight />
          </button>
          <button
            className="h-8 rounded-r-md bg-white p-1 text-black min-w-[20px]"
            onClick={() => getRankedTeams(null, totalPages)}
            disabled={currentPage === totalPages}
          >
            <AiOutlineDoubleRight />
          </button>
          <h3 className="ml-4 flex items-center text-sm text-white">
            Page {currentPage} of {totalPages}
          </h3>
        </div>
      </div>
    </main>
  )
}