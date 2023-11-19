"use client"
import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {
  Event,
  EventMatch,
  TeamProfile,
  Division,
  EventRank,
  TeamIdentifiers,
  EventRankWithMetrics,
  EventAward, SkillsRun, CombinedTeamSkills
} from "@/app/types";
import ScoutingSheetDialog from "@/components/ScoutingSheetDialog";
import RankingsScoutingSheetDialog from "@/components/RankingsScoutingSheetDialog";
import MatchNotesDialog from "@/components/MatchNotesDialog";
import MatchResult from "@/components/MatchResult";
import {useUser} from "@clerk/nextjs";
import MatchTeamResult from "@/components/MatchTeamResult";
import TeamNotesDialog from "@/components/TeamNotesDialog";
import {AiFillStar, AiOutlineStar} from "react-icons/ai";
import EventRankComponent from "@/components/EventRankComponent";
import AwardResult from "@/components/AwardResult";
import SkillsResult from "@/components/SkillsResult";
import * as tf from '@tensorflow/tfjs';
import {
  matrix,
  multiply,
  pinv,
  concat,
} from "mathjs";
import useSWR from 'swr'


// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then(res => res.json())

export default function EventPage({params}: { params: { eventCode: string } }) {
  const {isLoaded, isSignedIn, user} = useUser();

  const [worldModel, setWorldModel] = useState<any>(null);
  const [eventModel, setEventModel] = useState<any>(null);

  useEffect(() => {
    async function loadModel() {
      const model = await tf.loadLayersModel('/predictionModel/model.json');
      const model2 = await tf.loadLayersModel('/eventPredictionModel/model.json');

      setWorldModel(model);
      setEventModel(model2);
    }

    loadModel();
  }, []);

  const eventCode = params.eventCode

  const [eventObject, setEventObject] = useState<Event | null>(null);
  const [participatingTeams, setParticipatingTeams] = useState<TeamProfile[]>([]);
  const [divisionFilteredTeams, setDivisionFilteredTeams] = useState<TeamProfile[]>([]);

  const [divisionList, setDivisionList] = useState<Division[]>([]);
  const [currentDivision, setCurrentDivision] = useState<Division | null>(null);
  const [currentTeamsDivision, setCurrentTeamsDivision] = useState<Division | null>({id: -1, name: "All"});
  const [matchList, setMatchList] = useState<EventMatch[]>([]);
  const [fiteredMatches, setFilteredMatches] = useState<EventMatch[]>([]);
  const [teamNumberFilter, setTeamNumberFilter] = useState<string>("");

  const [rankings, setRankings] = useState<EventRank[]>([]);

  const [rankingsWithMetrics, setRankingsWithMetrics] = useState<EventRankWithMetrics[]>([]);
  const [rankingsWithMetricsSorted, setRankingsWithMetricsSorted] = useState<EventRankWithMetrics[]>([]);

  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [rankingsExportDialogOpen, setRankingsExportDialogOpen] = useState(false);
  const [matchNotesDialogOpen, setMatchNotesDialogOpen] = useState(false);
  const [teamNotesDialogOpen, setTeamNotesDialogOpen] = useState(false);

  const [currentNotesTeam, setCurrentNotesTeam] = useState<TeamProfile | null>(null);

  const [favorited, setFavorited] = useState(false);

  const [rankedStatistic, setRankedStatistic] = useState("rank")

  const [awards, setAwards] = useState<EventAward[]>([])

  const [skills, setSkills] = useState<CombinedTeamSkills[]>([])

  const { data: awardsData, error: awardsError, isLoading: awardsIsLoading } = useSWR(eventObject ? `/api/events/${eventObject.id}/awards` : null, fetcher)

  useEffect(() => {
    if (awardsData) {
      setAwards(awardsData.awards)
    }
  }, [awardsData])

  const { data: eventData, error: eventDataError, isLoading: eventDataIsLoading } = useSWR(`/api/events/?eventSKU=${eventCode}`, fetcher)

  useEffect(() => {
    if (eventData) {
      setEventObject(eventData.events[0])
      setDivisionList(eventData.events[0].divisions)
      setCurrentDivision(eventData.events[0].divisions[0])
    }
  }, [eventData])

  const { data: teamsData, error: teamsError, isLoading: teamsIsLoading } = useSWR(eventObject ? `/api/events/${eventObject.id}/teams` : null, fetcher)

  useEffect(() => {
    if (teamsData) {
      setParticipatingTeams(teamsData.teams)
    }
  }, [teamsData])

  const { data: favoritesData, error: favoritesError, isLoading: favoritesIsLoading } = useSWR(isSignedIn && eventObject ? `/api/favorites/?eventId=${eventObject?.id}&favoriteType=event` : null, fetcher)

  useEffect(() => {
    if (favoritesData) {
      setFavorited(favoritesData.favorites.length > 0)
    }
  }, [favoritesData])

  useEffect(() => {
    if (currentTeamsDivision) {
      if (currentTeamsDivision.id === -1) {
        setDivisionFilteredTeams(participatingTeams);
        return;
      }

      if (currentTeamsDivision.id === currentDivision?.id) {
        const teamIdsFoundFromMatches: number[] = [];

        matchList.forEach((match) => {
          match.blueTeams.forEach((team) => {
            if (!teamIdsFoundFromMatches.includes(team.teamId)) {
              teamIdsFoundFromMatches.push(team.teamId);
            }
          });
          match.redTeams.forEach((team) => {
            if (!teamIdsFoundFromMatches.includes(team.teamId)) {
              teamIdsFoundFromMatches.push(team.teamId);
            }
          });
        });

        setDivisionFilteredTeams(
          participatingTeams.filter((team: TeamProfile) => teamIdsFoundFromMatches.includes(team.teamId))
        );

        return;
      } else {
        setCurrentDivision(currentTeamsDivision);
      }
    }
  }, [currentTeamsDivision, matchList, participatingTeams]);

  useEffect(() => {
    if (matchList.length !== 0 && participatingTeams.length !== 0 && rankings.length !== 0) {
      const completedMatches = matchList.filter((match) => {
        return match.blueScore !== 0 && match.redScore !== 0;
      });

      if (completedMatches.length === 0) {
        return;
      }

      const playingTeams: (TeamIdentifiers | null)[] = [];

      completedMatches.forEach((match: EventMatch) => {
        [...match.redTeams, ...match.blueTeams].forEach((team: TeamIdentifiers | null) => {
          if (!team) {
            return null;
          }

          const existingTeam = !playingTeams.some((existingTeam: TeamIdentifiers | null): boolean => {
            return (existingTeam != null && existingTeam.teamId === team.teamId)
          });

          if (existingTeam) {
            playingTeams.push(team);
          }
        });
      });

      let matchScoresMatrix = matrix()
      let matchOpponentScoresMatrix = matrix()

      const matchTeamsMatrix = matrix(
        completedMatches.flatMap((match: EventMatch) => {
          const redRow = playingTeams.map((team: TeamIdentifiers | null) => {
            if (!team) {
              return 0;
            }

            const teamHere = match.redTeams.some((redTeam: TeamIdentifiers | null) => {
              if (!redTeam) {
                return false;
              } else {
                return redTeam.teamId === team.teamId
              }
            })

            if (teamHere) {
              return 1;
            } else {
              return 0;
            }
          });

          const blueRow = playingTeams.map((team: TeamIdentifiers | null) => {
            if (!team) {
              return 0;
            }

            const teamHere = match.blueTeams.some((blueTeam: TeamIdentifiers | null) => {
              if (!blueTeam) {
                return false;
              } else {
                return blueTeam.teamId === team.teamId
              }
            })

            if (teamHere) {
              return 1;
            } else {
              return 0;
            }
          });

          matchScoresMatrix = matrix(
            concat(matchScoresMatrix, [match.redScore], [match.blueScore], 0)
          );
          matchOpponentScoresMatrix = matrix(
            concat(matchOpponentScoresMatrix, [match.blueScore], [match.redScore], 0)
          );

          return [redRow, blueRow];
        })
      );

      try {
        const matchTeamsPseudoInverse = pinv(matchTeamsMatrix);

        const oprMatrix = multiply(matchTeamsPseudoInverse, matchScoresMatrix);
        const dprMatrix = multiply(matchTeamsPseudoInverse, matchOpponentScoresMatrix);


        const newRankingsWithMetrics: EventRankWithMetrics[] = [];

        for (let j = 0; j < oprMatrix.size()[0]; j++) {
          const team: TeamIdentifiers | null = playingTeams[j];

          if (!team) {
            continue;
          }

          const opr: number = +oprMatrix.get([j]).toFixed(4);
          const dpr: number = +dprMatrix.get([j]).toFixed(4);
          const ccwm: number = +(opr - dpr).toFixed(4);

          const foundRanking = rankings.find((ranking) => ranking.team.teamId === team.teamId);

          if (!foundRanking) {
            continue;
          }

          const newRanking: EventRankWithMetrics = {
            ...foundRanking,
            opr,
            dpr,
            ccwm,
          };

          newRankingsWithMetrics.push(newRanking);
        }

        newRankingsWithMetrics.sort((a: EventRankWithMetrics, b: EventRankWithMetrics) => {
          return a.rank - b.rank;
        });

        setRankingsWithMetrics(newRankingsWithMetrics);

      } catch (err) {
        console.log(err);
        setRankingsWithMetrics([
          ...rankings.map((ranking) => {
            return {
              ...ranking,
              opr: 0,
              dpr: 0,
              ccwm: 0,
            }
          })
        ]);
      }
    }
  }, [matchList, participatingTeams, rankings]);

  useEffect(() => {
    if (rankingsWithMetrics.length !== 0) {
      const newRankingsWithMetrics = [...rankingsWithMetrics];

      if (rankedStatistic === "rank") {
        newRankingsWithMetrics.sort((a: EventRankWithMetrics, b: EventRankWithMetrics) => {
          return a.rank - b.rank;
        });
      } else if (rankedStatistic === "opr") {
        newRankingsWithMetrics.sort((a: EventRankWithMetrics, b: EventRankWithMetrics) => {
          return b.opr - a.opr;
        });
      } else if (rankedStatistic === "dpr") {
        newRankingsWithMetrics.sort((a: EventRankWithMetrics, b: EventRankWithMetrics) => {
          return a.dpr - b.dpr;
        });
      } else if (rankedStatistic === "ccwm") {
        newRankingsWithMetrics.sort((a: EventRankWithMetrics, b: EventRankWithMetrics) => {
          return b.ccwm - a.ccwm;
        });
      } else if (rankedStatistic === "ap") {
        newRankingsWithMetrics.sort((a: EventRankWithMetrics, b: EventRankWithMetrics) => {
          return b.ap - a.ap;
        });
      } else if (rankedStatistic === "sp") {
        newRankingsWithMetrics.sort((a: EventRankWithMetrics, b: EventRankWithMetrics) => {
          return b.sp - a.sp;
        });
      }

      setRankingsWithMetricsSorted(newRankingsWithMetrics);
    }
  }, [rankedStatistic, rankingsWithMetrics]);

  useEffect(() => {
    if (teamNumberFilter !== "") {
      const newFilteredMatches: EventMatch[] = [];

      matchList.forEach((match) => {
        if (match.blueTeams.find((team) => team.teamNumber.startsWith(teamNumberFilter.toUpperCase())) || match.redTeams.find((team) => team.teamNumber.startsWith(teamNumberFilter.toUpperCase()))) {
          newFilteredMatches.push(match);
        }
      });

      setFilteredMatches(newFilteredMatches);
    } else {
      setFilteredMatches(matchList);
    }
  }, [teamNumberFilter, matchList]);

  const { data: matchData, error: matchDataError, isLoading: matchDataIsLoading } = useSWR(currentDivision && (currentDivision.name !== "Default") ? `/api/events/${eventObject?.id}/${currentDivision.id}/matches` : null, fetcher)

  useEffect(() => {
    if (matchData) {
      const dateSortedMatches = matchData.matches.sort(customSort);
      setMatchList(dateSortedMatches);
    }
  }, [matchData])

  const { data: rankingsData, error: rankingsDataError, isLoading: rankingsDataIsLoading } = useSWR(currentDivision && (currentDivision.name !== "Default") ? `/api/events/${eventObject?.id}/${currentDivision.id}/rankings` : null, fetcher)

  useEffect(() => {
    if (rankingsData) {
      const rankSortedRankings = rankingsData.rankings.sort((a: EventRank, b: EventRank) => {
        return a.rank - b.rank;
      });

      setRankings(rankSortedRankings);
    }
  }, [rankingsData])

  const { data: skillsData, error: skillsDataError, isLoading: skillsDataIsLoading } = useSWR(eventObject ? `/api/events/${eventObject?.id}/skills` : null, fetcher)

  useEffect(() => {
    if (skillsData && participatingTeams.length !== 0) {
      const teamSkills: CombinedTeamSkills[] = [];
      const teamToSkills: Record<number, SkillsRun[]> = {};

      skillsData.skills.forEach((skill: SkillsRun) => {
        if (!teamToSkills[skill.team.teamId]) {
          teamToSkills[skill.team.teamId] = [];
        }

        teamToSkills[skill.team.teamId].push(skill);
      });

      Object.keys(teamToSkills).forEach((teamId) => {
        const team = participatingTeams.find((team) => team.teamId === parseInt(teamId));

        if (!team) {
          return;
        }

        const greatestDriverScore = teamToSkills[team.teamId].reduce((greatestScore: number, skill: SkillsRun) => {
          if (skill.type === "driver" && skill.score > greatestScore) {
            return skill.score;
          }

          return greatestScore;
        }, 0);

        const greatestProgrammingScore = teamToSkills[team.teamId].reduce((greatestScore: number, skill: SkillsRun) => {
          if (skill.type === "programming" && skill.score > greatestScore) {
            return skill.score;
          }

          return greatestScore;
        }, 0);

        teamSkills.push({
          teamId: team.teamId,
          teamName: team.teamName,
          teamNumber: team.teamNumber,
          progSkills: greatestProgrammingScore,
          driverSkills: greatestDriverScore,
          totalSkills: greatestDriverScore + greatestProgrammingScore,
          rank: 0,
        });
      });

      teamSkills.sort((a: CombinedTeamSkills, b: CombinedTeamSkills) => {
        return b.totalSkills - a.totalSkills;
      });

      teamSkills.forEach((teamSkill: CombinedTeamSkills, index: number) => {
        teamSkill.rank = index + 1;
      });

      setSkills(teamSkills);
    }
  }, [skillsData, participatingTeams])

  const changeFavoriteStatus = async (favorite: boolean) => {
    if (!eventObject) {
      return;
    }

    if (!isSignedIn) {
      toast.error("You must be signed in to favorite an event");
      return;
    }

    if (favorite) {
      try {
        const response = await fetch(`/api/favorites`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventId: eventObject.id,
            favoriteType: "event",
          }),
        })

        const data = await response.json();

        if (data?.error) {
          toast.error(data.error)
          return;
        }

        setFavorited(data.success);
      } catch (err) {
        toast.error(err as any)
      }
    } else {
      try {
        const response = await fetch(`/api/favorites`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventId: eventObject.id,
            favoriteType: "event",
          })
        });

        const data = await response.json();

        if (data?.error) {
          toast.error(data.error)
          return;
        }

        setFavorited(!data.success);
      } catch (err) {
        toast.error(err as any)
      }
    }
  }

  const customSort = (a: EventMatch, b: EventMatch) => {
    // Adjust the order of "round" values
    const roundOrder: Record<number, number> = {
      1: 1, // Practice
      2: 2, // Qualification
      6: 3, // Round of 16
      3: 4, // Quarter-Finals
      4: 5, // Semi-Finals
      5: 6, // Finals
    };

    // First, sort by adjusted "round" values
    if (roundOrder[a.round] !== roundOrder[b.round]) {
      return roundOrder[a.round] - roundOrder[b.round];
    }

    // If "round" is the same, sort by "matchnum"
    if (a.matchnum !== b.matchnum) {
      return a.matchnum - b.matchnum;
    }

    if (a.instance !== b.instance) {
      return a.instance - b.instance;
    }

    return 0;
  }

  const formatDate = (date: string) => {
    return (new Date(date)).toLocaleString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'GMT',
    })
  }

  return (
    <main>
      <div className="flex w-full flex-col items-center justify-center py-32 sm:py-32">
        {eventObject ? <>
          <div
            className="relative mb-8 flex h-auto flex-col justify-center rounded-2xl bg-neutral-800 p-8 items-left max-w-[340px] sm:min-w-[500px] md:min-w-[700px] lg:min-w-[900px] xl:min-w-[1200px]">
            <h1 className="mb-5 min-w-fit text-2xl font-bold xs:text-3xl sm:text-4xl md:text-5xl lg:text-7xl">
              {eventObject.name}
            </h1>
            <div className="absolute max-w-max top-0.5 right-0.5 xl:top-2 xl:right-2">
              <button
                className="flex items-center justify-center text-2xl font-extrabold min-w-[50px] min-h-[50px]"
                onClick={(e) => {
                  e.preventDefault()
                  if (isSignedIn) {
                    changeFavoriteStatus(!favorited);
                    return;
                  } else {
                    toast.error("You must be signed in to favorite an event");
                  }
                }}
              >
                {favorited ? <AiFillStar className="inline-block"/> : <AiOutlineStar className="inline-block"/>}
              </button>
            </div>
            <a href={`https://www.robotevents.com/robot-competitions/vex-robotics-competition/${eventCode}.html`}
               className="mb-5 max-w-fit text-lg font-bold hover:text-blue-500 xs:text-xl">
              <u>RobotEvents Page</u>
            </a>
            <div className="flex flex-row gap-5 md:gap-10">
              <div className="flex flex-col gap-5 mim-w-[49%]">
                <div className="flex flex-col">
                  <h3 className="font-bold text-md sm:text-xl">
                    Location:
                  </h3>
                  <h3 className="text-sm sm:text-lg">
                    {eventObject.location.city ? eventObject.location.city + ", " : ""}{eventObject.location.region + ", "}{eventObject.location.country}
                  </h3>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-bold text-md sm:text-xl">
                    SKU:
                  </h3>
                  <h3 className="text-sm sm:text-lg">
                    {eventObject.sku}
                  </h3>
                </div>
              </div>
              <div className="flex flex-col gap-5 min-w-[49%]">
                <div className="flex flex-col">
                  <h3 className="font-bold text-md sm:text-xl">
                    Date:
                  </h3>
                  <h3 className="text-sm sm:text-lg">
                    {formatDate(eventObject.start)} - {formatDate(eventObject.end)}
                  </h3>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-bold text-md sm:text-xl">
                    Season:
                  </h3>
                  <h3 className="text-sm sm:text-lg">
                    {eventObject.season.name}
                  </h3>
                </div>
              </div>
            </div>
          </div>
          <Tabs defaultValue="teams">
            <TabsList
              className="bg-neutral-800 flex min-w-[340px] sm:min-w-[500px] md:min-w-[700px] lg:min-w-[900px] xl:min-w-[1200px] mb-8 [&>*]:flex-1">
              <TabsTrigger value="teams">Teams</TabsTrigger>
              <TabsTrigger value="rankings">Rankings</TabsTrigger>
              <TabsTrigger value="matches">Matches</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="awards">Awards</TabsTrigger>
            </TabsList>
            <div
              className="flex h-auto flex-col justify-center rounded-2xl bg-neutral-800 p-8 items-left max-w-[340px] sm:min-w-[500px] md:min-w-[700px] lg:min-w-[900px] xl:min-w-[1200px]">
              <TabsContent value="teams">
                <div className="mb-10 flex flex-col justify-between xl:flex-row">
                  <h3 className="mb-5 min-w-fit text-3xl font-bold xs:text-5xl xl:mb-0">
                    Teams
                  </h3>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      className="h-8 min-w-max rounded-lg bg-white text-sm text-black sm:w-44 md:h-12 md:w-52 md:text-lg"
                      onClick={() => setExportDialogOpen(true)}
                    >
                      Generate Scout Sheet
                    </button>
                    <select
                      className="h-8 min-w-max rounded-lg bg-white pl-2 text-sm text-black sm:w-44 md:h-12 md:w-52 md:text-lg"
                      required
                      value={currentTeamsDivision?.id}
                      onChange={(event) => {
                        // @ts-ignore
                        const newValue = (parseInt(event.target.id) === -1 ? {
                          id: -1,
                          name: "All"
                        } : divisionList.find((division) => division.id === parseInt(event.target.value)) || null);
                        setCurrentTeamsDivision(newValue);
                      }}
                    >
                      <option value={-1} key={-1}>All</option>
                      {divisionList.map((division) => {
                        return (
                          <option key={division.id} value={division.id}>{division.name}</option>
                        )
                      })}
                    </select>
                    <input
                      className="h-8 min-w-max rounded-lg bg-white p-3 text-sm text-black sm:w-44 md:h-12 md:w-52 md:text-lg"
                      type="text"
                      value={teamNumberFilter}
                      placeholder="Filter by team..."
                      onChange={(e) => setTeamNumberFilter(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-4 w-[100%]">
                  {teamsIsLoading ?
                    <h1 className="text-2xl font-semibold text-neutral-200">
                      Loading...
                    </h1>
                    : null}
                  {divisionFilteredTeams.length === 0 && !teamsIsLoading ?
                    <h1 className="text-2xl font-semibold text-neutral-200">
                      No teams found
                    </h1>
                    : null}
                  {divisionFilteredTeams.length !== 0 ? divisionFilteredTeams.map((result: TeamProfile) => {
                    if (teamNumberFilter !== "" && !result.teamNumber.startsWith(teamNumberFilter.toUpperCase())) {
                      return null;
                    }

                    const locationString = `${result.teamCity ? result.teamCity + ", " : ""}${result.teamRegion ? result.teamRegion + ", " : ""}${result.teamCountry}`;

                    return (
                      <MatchTeamResult
                        key={result.teamNumber}
                        teamId={result.teamId}
                        teamNumber={result.teamNumber}
                        teamName={result.teamName}
                        programCode={result.programCode}
                        teamGrade={result.teamGrade}
                        location={locationString}
                        teamOrg={result.teamOrg}
                        openMatchNotes={(teamId: number) => {
                          if (isSignedIn) {
                            const foundTeamProfile = participatingTeams.find((team) => team.teamId === teamId);
                            if (!foundTeamProfile) {
                              toast.error("Team not found");
                              setCurrentNotesTeam(null)
                              setTeamNotesDialogOpen(false)
                              return;
                            }
                            setCurrentNotesTeam(foundTeamProfile);
                            setTeamNotesDialogOpen(true);
                          } else {
                            toast.error("You must be signed in to view match notes");
                          }
                        }}
                      />
                    )
                  }) : null}
                </div>
                <ScoutingSheetDialog
                  exportDialogOpen={exportDialogOpen}
                  eventObject={eventObject}
                  participatingTeams={participatingTeams}
                  loadingTeams={teamsIsLoading}
                  setExportDialogOpen={setExportDialogOpen}
                />
                {isSignedIn ?
                  <TeamNotesDialog
                    teamNotesDialogOpen={teamNotesDialogOpen}
                    currentNotesTeam={currentNotesTeam}
                    seasonId={eventObject.season.id}
                    setTeamNotesDialogOpen={setTeamNotesDialogOpen}
                  />
                  : null}
              </TabsContent>
              <TabsContent value="rankings">
                <div className="mb-10 flex flex-col">
                  <h3 className="mb-5 min-w-fit text-3xl font-bold xs:text-5xl">
                    Rankings
                  </h3>
                  <div className="flex gap-3 sm:flex-wrap sm:flex-row flex-nowrap flex-col">
                    <button
                      className="h-8 min-w-max rounded-lg bg-white text-sm text-black sm:w-52 md:h-12 md:w-52 md:text-lg"
                      onClick={() => setRankingsExportDialogOpen(true)}
                    >
                      Generate Scout Sheet
                    </button>
                    <select
                      className="h-8 min-w-max rounded-lg bg-white pl-2 text-sm text-black sm:w-52 md:h-12 md:w-52 md:text-lg"
                      required
                      value={rankedStatistic}
                      onChange={(event) => {
                        setRankedStatistic(event.target.value);
                      }}
                    >
                      <option value="rank">Rank</option>
                      <option value="opr">OPR (Contrib. to score)</option>
                      <option value="dpr">DPR (Contrib. to opp score)</option>
                      <option value="ccwm">CCWM (OPR - DPR)</option>
                      <option value="ap">AP (Auton Win Points)</option>
                      <option value="sp">SP (Opponent Strength)</option>
                    </select>
                    <select
                      className="h-8 min-w-max rounded-lg bg-white pl-2 text-sm text-black sm:w-52 md:h-12 md:w-52 md:text-lg"
                      required
                      value={currentDivision?.id}
                      onChange={(event) => {
                        // @ts-ignore
                        setCurrentDivision(divisionList.find((division) => division.id === event.target.value) || null);
                      }}
                    >
                      <option value={999} disabled hidden>Select Division</option>
                      {divisionList.map((division) => {
                        return (
                          <option key={division.id} value={division.id}>{division.name}</option>
                        )
                      })}
                    </select>
                    <input
                      className="h-8 min-w-max rounded-lg bg-white p-3 text-sm text-black sm:w-52 md:h-12 md:w-52 md:text-lg"
                      type="text"
                      value={teamNumberFilter}
                      placeholder="Filter by team..."
                      onChange={(e) => setTeamNumberFilter(e.target.value)}
                    />
                  </div>
                </div>
                {rankingsDataIsLoading ?
                  <h1 className="text-2xl font-semibold text-neutral-200">
                    Loading...
                  </h1>
                  : null}
                {rankings.length === 0 && !rankingsDataIsLoading ?
                  <h1 className="text-2xl font-semibold text-neutral-200">
                    No rankings found, insufficient match data to calculate rankings
                  </h1>
                  : null}
                <div className="flex flex-col gap-4 overflow-auto w-[100%]">
                  {rankingsWithMetricsSorted.length !== 0 ? rankingsWithMetricsSorted.map((result: EventRankWithMetrics) => {
                    const foundTeamProfile = participatingTeams.find((team) => team.teamId === result.team.teamId);
                    if (!foundTeamProfile) {
                      return null;
                    }

                    if (teamNumberFilter !== "" && !foundTeamProfile.teamNumber.startsWith(teamNumberFilter.toUpperCase())) {
                      return null;
                    }

                    return (
                      <EventRankComponent
                        key={foundTeamProfile.teamId}
                        rank={result}
                        team={foundTeamProfile}
                      />
                    )
                  }) : null}
                </div>
                <RankingsScoutingSheetDialog
                  exportDialogOpen={rankingsExportDialogOpen}
                  eventObject={eventObject}
                  rankingsWithMetrics={rankingsWithMetricsSorted}
                  teamProfiles={divisionFilteredTeams}
                  setExportDialogOpen={setRankingsExportDialogOpen}
                />
              </TabsContent>
              <TabsContent value="matches">
                <div className="mb-10 flex flex-col justify-between xl:flex-row">
                  <h3 className="mb-5 min-w-fit text-3xl font-bold xs:text-5xl xl:mb-0">
                    Matches
                  </h3>
                  <div className="flex gap-3 sm:flex-wrap sm:flex-row flex-nowrap flex-col">
                    <button
                      className="h-8 min-w-max rounded-lg bg-white text-sm text-black disabled:opacity-50 sm:w-44 md:h-12 md:w-52 md:text-lg"
                      onClick={() => {
                        if (!isSignedIn) {
                          toast.error("You must be signed in to view match notes");
                          return;
                        } else {
                          setMatchNotesDialogOpen(true)
                        }
                      }}
                    >
                      Match Notes
                    </button>
                    <select
                      className="h-8 min-w-max rounded-lg bg-white pl-2 text-sm text-black sm:w-44 md:h-12 md:w-52 md:text-lg"
                      required
                      value={currentDivision?.id}
                      onChange={(event) => {
                        // @ts-ignore
                        setCurrentDivision(divisionList.find((division) => division.id === event.target.value) || null);
                      }}
                    >
                      <option value={999} disabled hidden>Select Division</option>
                      {divisionList.map((division) => {
                        return (
                          <option key={division.id} value={division.id}>{division.name}</option>
                        )
                      })}
                    </select>
                    <input
                      className="h-8 min-w-max rounded-lg bg-white p-3 text-sm text-black sm:w-44 md:h-12 md:w-52 md:text-lg"
                      type="text"
                      value={teamNumberFilter}
                      placeholder="Filter by team..."
                      onChange={(e) => setTeamNumberFilter(e.target.value)}
                    />
                  </div>
                </div>
                {matchList.length === 0 && !matchDataIsLoading ?
                  <h1 className="text-2xl font-semibold text-neutral-200">
                    No matches found
                  </h1>
                : null}
                <div className="flex flex-col gap-4 overflow-auto w-[100%]">
                  {fiteredMatches.length !== 0 ? fiteredMatches.map((result: EventMatch) => {
                    return (
                      <MatchResult
                        key={result.id}
                        seasonId={eventObject.season.id}
                        eventMatch={result}
                        eventModel={eventModel}
                        worldModel={worldModel}
                        eventRankings={rankingsWithMetrics}
                      />
                    )
                  }) : null}
                </div>
                {isSignedIn ?
                  <MatchNotesDialog
                    matchNotesDialogOpen={matchNotesDialogOpen}
                    eventObject={eventObject}
                    matchList={matchList}
                    setMatchNotesDialogOpen={setMatchNotesDialogOpen}
                  />
                  : null}
              </TabsContent>
              <TabsContent value="skills">
                <div className="mb-10 flex flex-col justify-between xl:flex-row">
                  <h3 className="mb-5 min-w-fit text-3xl font-bold xs:text-5xl xl:mb-0">
                    Skills
                  </h3>
                  <div className="flex gap-3 sm:flex-wrap sm:flex-row flex-nowrap flex-col">
                    <input
                      className="h-8 min-w-max rounded-lg bg-white p-3 text-sm text-black sm:w-44 md:h-12 md:w-52 md:text-lg"
                      type="text"
                      value={teamNumberFilter}
                      placeholder="Filter by team..."
                      onChange={(e) => setTeamNumberFilter(e.target.value)}
                    />
                  </div>
                </div>
                {skillsDataIsLoading ?
                  <h1 className="text-2xl font-semibold text-neutral-200">
                    Loading...
                  </h1>
                  : null}
                {skills.length === 0 && !skillsDataIsLoading ?
                  <h1 className="text-2xl font-semibold text-neutral-200">
                    No skills runs found
                  </h1>
                  : null}
                <div className="flex flex-col gap-4 overflow-auto w-[100%]">
                  {skills.length !== 0 ? skills.map((result: CombinedTeamSkills) => {
                    if (teamNumberFilter !== "" && !result.teamNumber.startsWith(teamNumberFilter.toUpperCase())) {
                      return null;
                    }

                    return (
                      <SkillsResult
                        key={result.teamId}
                        skills={result}
                      />
                    )
                  }) : null}
                </div>
              </TabsContent>
              <TabsContent value="awards">
                <div className="mb-10 flex flex-col justify-between xl:flex-row">
                  <h3 className="mb-5 min-w-fit text-3xl font-bold xs:text-5xl xl:mb-0">
                    Awards
                  </h3>
                  <div className="flex gap-3 sm:flex-wrap sm:flex-row flex-nowrap flex-col">
                    <input
                      className="h-8 min-w-max rounded-lg bg-white p-3 text-sm text-black sm:w-44 md:h-12 md:w-52 md:text-lg"
                      type="text"
                      value={teamNumberFilter}
                      placeholder="Filter by team..."
                      onChange={(e) => setTeamNumberFilter(e.target.value)}
                    />
                  </div>
                </div>
                {awardsIsLoading ?
                  <h1 className="text-2xl font-semibold text-neutral-200">
                    Loading...
                  </h1>
                  : null}
                {awards.length === 0 && !awardsIsLoading ?
                  <h1 className="text-2xl font-semibold text-neutral-200">
                    No awards found
                  </h1>
                  : null}
                <div className="flex flex-col gap-4 overflow-auto w-[100%]">
                  {awards.length !== 0 ? awards.map((result: EventAward) => {
                    const foundTeamProfile = participatingTeams.find((team) => team.teamId === result.team.teamId);

                    if (!foundTeamProfile) {
                      return null;
                    }

                    if (teamNumberFilter !== "" && !foundTeamProfile.teamNumber.startsWith(teamNumberFilter.toUpperCase())) {
                      return null;
                    }

                    return (
                      <AwardResult
                        key={result.id}
                        award={result}
                        team={foundTeamProfile}
                      />
                    )
                  }) : null}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </> : null}
      </div>
    </main>
  )
}