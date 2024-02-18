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
import EventTeamResult from "@/components/EventTeamResult";
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
import { useSearchParams, useRouter } from 'next/navigation'
import {FaClipboardList, FaRegSadTear, FaTrophy} from "react-icons/fa";
import { FaRankingStar } from "react-icons/fa6";
import {GiTrumpet} from "react-icons/gi";
import {GoNumber} from "react-icons/go";
import { FaMapMarkedAlt } from "react-icons/fa";
import { useGlobalStore } from "@/state/globalState";
import { RelavancyType } from "@/app/types";
import { TiDeleteOutline } from "react-icons/ti";
import Spinner from "@/components/Spinner";

const SWROptions = {
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  refreshWhenHidden: false,
  refreshWhenOffline: false,
  focusThrottleInterval: 30 * 1000,
}

enum TabType {
  matches = "matches",
  rankings = "rankings",
  teams = "teams",
  skills = "skills",
  awards = "awards"
}

// @ts-ignore
const fetcher = (...args: any[]) => fetch(...args).then(res => {
  if (res.status === 200) {
    return res.json()
  } else if (res.status === 429) {
    throw new Error("Too many requests")
  } else {
    throw new Error("Couldn't fetch data")
  }
})

export default function EventPage({params}: { params: { eventCode: string } }) {
  const {isLoaded, isSignedIn, user} = useUser();
  const router = useRouter();
  const searchParams = useSearchParams()

  const teamParam = searchParams.get("team")
  const tabParam = searchParams.get("tab")

  const [tab, setTab] = useState<TabType>(teamParam ? "matches" as TabType : (tabParam ? tabParam as  TabType: "teams" as TabType))

  const onTabChange = (value: String) => {
    setTab(value as TabType)
    router.replace(`/events/${params.eventCode}?tab=${value}`, {scroll: false})
  }

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
  const [teamNumberFilter, setTeamNumberFilter] = useState<string>(teamParam ? teamParam : "");

  const [rankings, setRankings] = useState<EventRank[]>([]);

  const [rankingsWithMetrics, setRankingsWithMetrics] = useState<EventRankWithMetrics[]>([]);
  const [rankingsWithMetricsSorted, setRankingsWithMetricsSorted] = useState<EventRankWithMetrics[]>([]);

  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [rankingsExportDialogOpen, setRankingsExportDialogOpen] = useState(false);
  const [matchNotesDialogOpen, setMatchNotesDialogOpen] = useState(false);
  const [teamNotesDialogOpen, setTeamNotesDialogOpen] = useState(false);

  const [currentNotesTeam, setCurrentNotesTeam] = useState<TeamProfile | null>(null);
  const [currentNotesMatch, setCurrentNotesMatch] = useState<EventMatch | null>(null);

  const currentUsersTeamNumber = useGlobalStore(state => state.currentUsersTeamNumber)
  const setUsersCurrentTeamNumber = useGlobalStore(state => state.setUsersCurrentTeamNumber)

  const [teamsToRelavancyType, setTeamsToRelavancyType] = useState<Record<number, RelavancyType>>({})

  const [favorited, setFavorited] = useState(false);

  const [rankedStatistic, setRankedStatistic] = useState("rank")

  const [awards, setAwards] = useState<EventAward[]>([])

  const [skills, setSkills] = useState<CombinedTeamSkills[]>([])
  const [skillsRanked, setSkillsRanked] = useState<CombinedTeamSkills[]>([])
  const [skillsSort, setSkillsSort] = useState<"total" | "driver" | "prog">("total")

  const [compactMatches, setCompactMatches] = useState<boolean>(false)

  const [statBrackets, setStatBrackets] = useState<{[key: string]: number}>({});

  const [reflectVIAStats, setReflectVIAStats] = useState<boolean>(true)


  useEffect(() => {
    if (skills.length === 0) {
      return
    }

    const newSkillsRanked = [...skills]

    if (skillsSort === "total") {
      newSkillsRanked.sort((a, b) => b.totalSkills - a.totalSkills)
    } else if (skillsSort === "driver") {
      newSkillsRanked.sort((a, b) => b.driverSkills - a.driverSkills)
    } else if (skillsSort === "prog") {
      newSkillsRanked.sort((a, b) => b.progSkills - a.progSkills)
    }

    setSkillsRanked(newSkillsRanked)
  }, [skills, skillsSort])

  const { data: eventData, error: eventDataError, isLoading: eventDataIsLoading } = useSWR(`/api/events/?eventSKU=${eventCode}`, fetcher, SWROptions)

  useEffect(() => {
    if (eventData && !eventDataError) {
      setEventObject(eventData.events[0])
      setDivisionList(eventData.events[0].divisions)
      setCurrentDivision(eventData.events[0].divisions[0])
    } else if (eventDataError) {
      // router.replace("/not-found", undefined)
    }
  }, [eventData, eventDataError])

  const { data: teamsData, error: teamsError, isLoading: teamsIsLoading } = useSWR(eventObject ? `/api/events/${eventObject.id}/teams` : null, fetcher, SWROptions)

  useEffect(() => {
    if (teamsData && !teamsError) {
      setParticipatingTeams(teamsData.teams)

      // if (teamParam && teamsData.teams.length > 0 && eventData?.events[0].divisions.length > 1) {
      //   const team = teamsData.teams.find((team: TeamProfile) => team.teamNumber === teamParam.toUpperCase())
      //   if (team) {
      //     const teamDivision = findTeamDivision(team)
      //     if (teamDivision) {
      //       setCurrentTeamsDivision(teamDivision)
      //     }
      //   }
      // }
    } else if (teamsError && !teamsIsLoading) {
      toast.error(teamsError + ": teams data")
    }
  }, [teamsData, teamsError])

  const { data: favoritesData, error: favoritesError, isLoading: favoritesIsLoading } = useSWR(isSignedIn && eventObject ? `/api/favorites/?eventId=${eventObject?.id}&favoriteType=event` : null, fetcher, SWROptions)

  useEffect(() => {
    if (favoritesData && !favoritesError) {
      setFavorited(favoritesData.favorites.length > 0)
    } else if (favoritesError && !favoritesIsLoading) {
      toast.error(favoritesError + ": favorites data")
    }
  }, [favoritesData, favoritesError])

  const { data: awardsData, error: awardsError, isLoading: awardsIsLoading } = useSWR(eventObject ? `/api/events/${eventObject.id}/awards` : null, fetcher, SWROptions)

  useEffect(() => {
    if (awardsData && !awardsError) {
      setAwards(awardsData.awards)
    } else if (awardsError) {
      toast.error(awardsError + ": awards data")
    }
  }, [awardsData, awardsError])

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

  // const findTeamDivision = (team: TeamProfile): Division | null => {
  //   let teamDivision: Division | null = null;
  //
  //   matchList.forEach((match: EventMatch) => {
  //     if (match.blueTeams.find((blueTeam) => blueTeam.teamId === team.teamId) || match.redTeams.find((redTeam) => redTeam.teamId === team.teamId)) {
  //       teamDivision = divisionList.find((division) => division.id === match.divisionId) || null;
  //     }
  //   })
  //
  //   return teamDivision
  // }

  useEffect(() => {
    if (matchList.length !== 0 && participatingTeams.length !== 0 && rankings.length !== 0) {
      let completedMatches = matchList;

      if (!reflectVIAStats) {
        completedMatches = matchList.filter((match) => {
          return match.blueScore !== 0 && match.redScore !== 0;
        });
      }

      if (completedMatches.length === 0) {
        return;
      }

      const playingTeams: TeamIdentifiers[] = [];

      completedMatches.forEach((match: EventMatch) => {
        [...match.redTeams, ...match.blueTeams].forEach((team: TeamIdentifiers | null) => {
          if (!team) {
            return null;
          }

          const existingTeam = playingTeams.some((existingTeam: TeamIdentifiers): boolean => {
            return (existingTeam.teamId === team.teamId)
          });

          if (!existingTeam) {
            playingTeams.push(team);
          }
        });
      });

      let matchScoresMatrix = matrix()
      let matchOpponentScoresMatrix = matrix()

      const matchTeamsMatrix = matrix(
        completedMatches.flatMap((match: EventMatch) => {
          const redRow = playingTeams.map((team: TeamIdentifiers) => {
            if (!team) {
              return 0;
            }

            const teamHere = match.redTeams.some((redTeam: TeamIdentifiers) => {
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

          const blueRow = playingTeams.map((team: TeamIdentifiers) => {
            if (!team) {
              return 0;
            }

            const teamHere = match.blueTeams.some((blueTeam: TeamIdentifiers) => {
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
          const team: TeamIdentifiers = playingTeams[j];

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

        // get the opr, dpr, and ccwm lowest value for the top 20% of teams
        let upperOPR: number = Infinity;
        let upperDPR: number = -Infinity;
        let upperCCWM: number = Infinity;

        // get the opr, dpr, and ccwm lowest value for the middle top 50% of teams
        let middleOPR: number = Infinity;
        let middleDPR: number = -Infinity;
        let middleCCWM: number = Infinity;

        const topOPR = [...newRankingsWithMetrics].sort((a: EventRankWithMetrics, b: EventRankWithMetrics) => {
          return b.opr - a.opr;
        })

        const topDPR = [...newRankingsWithMetrics].sort((a: EventRankWithMetrics, b: EventRankWithMetrics) => {
          return a.dpr - b.dpr;
        })

        const topCCWM = [...newRankingsWithMetrics].sort((a: EventRankWithMetrics, b: EventRankWithMetrics) => {
          return b.ccwm - a.ccwm;
        })

        topOPR.forEach((ranking: EventRankWithMetrics, index: number) => {
          if (index < topOPR.length * 0.35) {
            if (ranking.opr < upperOPR) {
              upperOPR = ranking.opr;
            }
          } else if (index < topOPR.length * 0.7) {
            if (ranking.opr < middleOPR) {
              middleOPR = ranking.opr;
            }
          }
        })

        topDPR.forEach((ranking: EventRankWithMetrics, index: number) => {
          if (index < topDPR.length * 0.35) {
            if (ranking.dpr > upperDPR) {
              upperDPR = ranking.dpr;
            }
          } else if (index < topDPR.length * 0.7) {
            if (ranking.dpr > middleDPR) {
              middleDPR = ranking.dpr;
            }
          }
        })

        topCCWM.forEach((ranking: EventRankWithMetrics, index: number) => {
          if (index < topCCWM.length * 0.1) {
            if (ranking.ccwm < upperCCWM) {
              upperCCWM = ranking.ccwm;
            }
          } else if (index < topCCWM.length * 0.7) {
            if (ranking.ccwm < middleCCWM) {
              middleCCWM = ranking.ccwm;
            }
          }
        })

        setStatBrackets({
          upperOPR,
          upperDPR,
          upperCCWM,
          middleOPR,
          middleDPR,
          middleCCWM
        })
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
  }, [matchList, participatingTeams, rankings, reflectVIAStats]);

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

  const { data: matchData, error: matchDataError, isLoading: matchDataIsLoading } = useSWR(currentDivision && (currentDivision.name !== "Default") ? `/api/events/${eventObject?.id}/${currentDivision.id}/matches` : null, fetcher, {...SWROptions, refreshInterval: 1000  * 60})

  useEffect(() => {
    if (matchData && !matchDataError) {
      const dateSortedMatches = matchData.matches.sort(customSort);
      setMatchList(dateSortedMatches);
    } else if (matchDataError && !matchDataIsLoading) {
      toast.error(matchDataError + ": match data")
    }
  }, [matchData])

  const { data: rankingsData, error: rankingsDataError, isLoading: rankingsDataIsLoading } = useSWR(currentDivision && (currentDivision.name !== "Default") ? `/api/events/${eventObject?.id}/${currentDivision.id}/rankings` : null, fetcher, {...SWROptions, refreshInterval: 1000  * 60})

  useEffect(() => {
    if (rankingsData && !rankingsDataError) {
      const rankSortedRankings = rankingsData.rankings.sort((a: EventRank, b: EventRank) => {
        return a.rank - b.rank;
      });

      setRankings(rankSortedRankings);
    } else if (rankingsDataError && !rankingsDataIsLoading) {
      toast.error(rankingsDataError + ": rankings data")
    }
  }, [rankingsData])

  const { data: skillsData, error: skillsDataError, isLoading: skillsDataIsLoading } = useSWR(eventObject ? `/api/events/${eventObject?.id}/skills` : null, fetcher, {...SWROptions, refreshInterval: 1000  * 60})

  useEffect(() => {
    if (skillsData && participatingTeams.length !== 0 && !skillsDataError) {
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
          progAttempts: teamToSkills[team.teamId].find((skill: SkillsRun) => skill.type === "programming")?.attempts || 0,
          driverAttempts: teamToSkills[team.teamId].find((skill: SkillsRun) => skill.type === "driver")?.attempts || 0,
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
    } else if (skillsDataError) {
      toast.error(skillsDataError + ": skills data")
    }
  }, [skillsData, participatingTeams])


  useEffect(() => {
    if (currentUsersTeamNumber === "" || !currentUsersTeamNumber) {
      setTeamsToRelavancyType({})
      return;
    }

    const teamInMatchList = participatingTeams.find((team) => team.teamNumber.toUpperCase() == currentUsersTeamNumber.toUpperCase())

    if (!teamInMatchList) {
      setTeamsToRelavancyType({})
      return;
    }

    let teamsToRelavancyType: {[key: number]: RelavancyType} = {}

    const currentTeamMatchList = matchList.filter((match: EventMatch) => {
      return match.redTeams.find((team) => team.teamNumber.toUpperCase() == currentUsersTeamNumber.toUpperCase()) || match.blueTeams.find((team) => team.teamNumber.toUpperCase() == currentUsersTeamNumber.toUpperCase())
    })

    currentTeamMatchList.map((match) => {
      const allianceTeam: "red" | "blue" = match.redTeams.find((team) => team.teamNumber == currentUsersTeamNumber.toUpperCase()) ? "red" : "blue";

      match.redTeams.map((team) => {
        teamsToRelavancyType[team.teamId] ? teamsToRelavancyType[team.teamId] = RelavancyType.both :
        teamsToRelavancyType[team.teamId] = allianceTeam === "red" ? RelavancyType.alliance : RelavancyType.opponent;
      })

      match.blueTeams.map((team) => {
        teamsToRelavancyType[team.teamId] ? teamsToRelavancyType[team.teamId] = RelavancyType.both :
        teamsToRelavancyType[team.teamId] = allianceTeam === "blue" ? RelavancyType.alliance : RelavancyType.opponent;
      })
    })

    teamsToRelavancyType[teamInMatchList.teamId] = RelavancyType.self

    setTeamsToRelavancyType(teamsToRelavancyType)

  }, [currentUsersTeamNumber, matchList, participatingTeams])

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

  useEffect(() => {
    if (currentNotesMatch) {
      setMatchNotesDialogOpen(true);
    } else {
      setMatchNotesDialogOpen(false);
    }
    }, [currentNotesMatch])

  return (
    <main>
      <div className="flex w-full flex-col items-center justify-center py-32 sm:py-32">
        {eventObject ? <>
          <div
            className="relative flex h-auto flex-col justify-center rounded-2xl sm:bg-neutral-800 sm:p-8 items-left w-[340px] sm:w-[500px] md:w-[700px] lg:w-[900px] xl:w-[1200px]">
            <h1 className="mb-5 min-w-[85%] max-w-[85%] text-2xl font-bold sm:text-3xl md:text-5xl lg:text-7xl text-shadow-sm sm:text-shadow lg:text-shadow-lg shadow-stone-400">
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
                    <button className="ml-2 hover:text-blue-500"
                      onClick={() => {
                        const searchParams = new URLSearchParams();
                        searchParams.append('api', '1');
                        searchParams.append('query', `${eventObject?.location.address}, ${eventObject?.location.city}, ${eventObject?.location.region}, ${eventObject?.location.country}`);
                        window.open(
                        `https://www.google.com/maps/search/?${searchParams.toString()}`,
                        "_blank"
                        );
                      }
                    }>
                    <FaMapMarkedAlt className="inline-block"/>
                    </button>
                  </h3>
                  <h3 className="text-sm sm:text-lg">
                    {eventObject?.location.venue ? eventObject.location.venue + ' @ ' : ''}{eventObject.location.city ? eventObject.location.city + ", " : ""}{eventObject.location.region + ", "}{eventObject.location.country}
                  </h3>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-bold text-md sm:text-xl">
                    SKU:
                  </h3>
                  <h3 className="text-sm sm:text-lg">
                    {eventObject?.sku}
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
          <hr className="sm:hidden block my-8 w-11/12 border-t-2 border-neutral-500"/>
          <Tabs value={tab} onValueChange={onTabChange}>
            <TabsList
              className="fixed sm:relative z-50 sm:z-0 bottom-0 left-0 px-2 pb-7 sm:pb-0 sm:bg-neutral-800 sm:h-10 h-[90px] flex w-screen sm:w-min sm:min-w-[500px] md:min-w-[700px] lg:min-w-[900px] xl:min-w-[1200px] sm:my-8 [&>*]:flex-1 bg-gradient-to-b
   to-neutral-800 from-GSGray sm:to-neutral-800 sm:from-neutral-800">
              <TabsTrigger value="teams" className="flex sm:flex-row flex-col h-14 text-2xs sm:h-8">
                <FaClipboardList className="inline-block sm:mr-2 text-lg"/>
                Teams
              </TabsTrigger>
              <TabsTrigger value="rankings" className="flex sm:flex-row flex-col h-14 text-2xs sm:h-8">
                <FaRankingStar className="inline-block sm:mr-2 text-lg"/>
                Rankings
              </TabsTrigger>
              <TabsTrigger value="matches" className="flex sm:flex-row flex-col h-14 text-2xs sm:h-8">
                <GiTrumpet className="inline-block sm:mr-2 text-lg"/>
                 Matches
              </TabsTrigger>
              <TabsTrigger value="skills" className="flex sm:flex-row flex-col h-14 text-2xs sm:h-8">
                <GoNumber className="inline-block sm:mr-2 text-lg"/>
                Skills
              </TabsTrigger>
              <TabsTrigger value="awards" className="flex sm:flex-row flex-col h-14 text-2xs sm:h-8">
                <FaTrophy className="inline-block sm:mr-2 text-lg"/>
                Awards
              </TabsTrigger>
            </TabsList>
            <div
              className="relative flex h-auto flex-col justify-center rounded-2xl sm:bg-neutral-800 mb-10 sm:p-8 items-left w-[340px] sm:w-[500px] md:w-[700px] lg:w-[900px] xl:w-[1200px]">
              <TabsContent value="teams">
                <div className="mb-10 flex flex-col justify-between xl:flex-row">
                  <h3 className="mb-5 min-w-fit font-bold text-3xl md:text-4xl">
                    Teams
                  </h3>
                  <div className="flex gap-3 sm:flex-wrap sm:flex-row flex-nowrap flex-col">
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
                        const newValue = (parseInt(event.target.value) === -1 ? {
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
                    <div className="relative min-w-max">
                      <input
                        className="h-8 w-full rounded-lg bg-white p-3 text-sm text-black sm:w-44 md:h-12 md:w-52 md:text-lg"
                        type="text"
                        value={teamNumberFilter}
                        placeholder="Filter by team..."
                        onChange={(e) => setTeamNumberFilter(e.target.value)}
                      />
                      <TiDeleteOutline
                        className="absolute right-2 top-2 text-lg cursor-pointer text-black"
                        onClick={() => setTeamNumberFilter("")}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1 w-[100%]">
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
                      <EventTeamResult
                        key={result.teamNumber}
                        teamId={result.teamId}
                        teamNumber={result.teamNumber}
                        teamName={result.teamName}
                        programCode={result.programCode}
                        teamGrade={result.teamGrade}
                        location={locationString}
                        teamOrg={result.teamOrg}
                        goToTeamMatches={() => {
                          setTeamNumberFilter(result.teamNumber);
                          setTab(TabType.matches);
                        }}
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
                  matchList={matchList}
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
                  <h3 className="mb-5 min-w-fit font-bold text-3xl md:text-4xl">
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
                        setCurrentDivision(divisionList.find((division) => division.id === parseInt(event.target.value)) || null);
                      }}
                    >
                      <option value={999} disabled hidden>Select Division</option>
                      {divisionList.map((division) => {
                        return (
                          <option key={division.id} value={division.id}>{division.name}</option>
                        )
                      })}
                    </select>
                    <div className="relative min-w-max">
                      <input
                        className="h-8 w-full rounded-lg bg-white p-3 text-sm text-black sm:w-44 md:h-12 md:w-52 md:text-lg"
                        type="text"
                        value={teamNumberFilter}
                        placeholder="Filter by team..."
                        onChange={(e) => setTeamNumberFilter(e.target.value)}
                      />
                      <TiDeleteOutline
                        className="absolute right-2 top-2 text-lg cursor-pointer text-black"
                        onClick={() => setTeamNumberFilter("")}
                      />
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-5 w-5"
                        checked={reflectVIAStats}
                        onChange={(event) => setReflectVIAStats(event.target.checked)}
                      />
                      <span className="text-xs sm:text-md xl:text-lg">Reflect Vex VIA/Account for unscored matches</span>
                    </label>
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
                <div className="flex flex-col gap-1 overflow-auto w-[100%]">
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
                        statBrackets={statBrackets}
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
                <div className="mb-10 flex flex-col justify-between">
                  <h3 className="mb-5 min-w-fit font-bold text-3xl md:text-4xl">
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
                        setCurrentDivision(divisionList.find((division) => division.id === parseInt(event.target.value)) || null);
                      }}
                    >
                      <option value={999} disabled hidden>Select Division</option>
                      {divisionList.map((division) => {
                        return (
                          <option key={division.id} value={division.id}>{division.name}</option>
                        )
                      })}
                    </select>
                    <div className="relative min-w-max">
                      <input
                        className="h-8 w-full rounded-lg bg-white p-3 text-sm text-black sm:w-44 md:h-12 md:w-52 md:text-lg"
                        type="text"
                        value={teamNumberFilter}
                        placeholder="Filter by team..."
                        onChange={(e) => setTeamNumberFilter(e.target.value)}
                      />
                      <TiDeleteOutline
                        className="absolute right-2 top-2 text-lg cursor-pointer text-black"
                        onClick={() => setTeamNumberFilter("")}
                      />
                    </div>
                    <div className="relative min-w-max">
                      <input
                        className="h-8 w-full rounded-lg bg-white p-3 text-sm text-black sm:w-44 md:h-12 md:w-72 md:text-lg"
                        type="text"
                        value={currentUsersTeamNumber ? currentUsersTeamNumber : ""}
                        placeholder="Label alliances/opponents for..."
                        onChange={(e) => setUsersCurrentTeamNumber(e.target.value)}
                      />
                      <TiDeleteOutline
                        className="absolute right-2 top-2 text-lg cursor-pointer text-black"
                        onClick={() => setUsersCurrentTeamNumber("")}
                      />
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-5 w-5"
                        checked={compactMatches}
                        onChange={(event) => setCompactMatches(event.target.checked)}
                      />
                      <span className="text-sm sm:text-md xl:text-lg">Compact Mode</span>
                    </label>
                  </div>
                </div>
                {matchList.length === 0 && !matchDataIsLoading ?
                  <h1 className="text-2xl font-semibold text-neutral-200">
                    No matches found
                  </h1>
                : null}
                <div className="flex flex-col gap-1.5 overflow-auto w-[100%]">
                  {fiteredMatches.length !== 0 ? fiteredMatches.map((result: EventMatch) => {
                    return (
                      <MatchResult
                        key={result.id}
                        seasonId={eventObject.season.id}
                        eventMatch={result}
                        eventModel={eventModel}
                        worldModel={worldModel}
                        eventRankings={rankingsWithMetrics}
                        teamsToRelavancyType={teamsToRelavancyType}
                        openMatchNotes={(matchId: number) => {
                          if (isSignedIn) {
                            const foundMatch = matchList.find((match) => match.id === matchId);
                            if (!foundMatch) {
                              toast.error("Match not found");
                              setCurrentNotesMatch(null)
                              return;
                            }
                            setCurrentNotesMatch(foundMatch);
                          } else {
                            toast.error("You must be signed in to view match notes");
                          }
                        }}
                        compact={compactMatches}
                      />
                    )
                  }) : null}
                </div>
                {isSignedIn ?
                  <MatchNotesDialog
                    matchNotesDialogOpen={matchNotesDialogOpen}
                    currentNotesMatch={currentNotesMatch ? currentNotesMatch : fiteredMatches[0]}
                    setCurrentNotesMatch={setCurrentNotesMatch}
                    eventObject={eventObject}
                    matchList={fiteredMatches}
                    setMatchNotesDialogOpen={setMatchNotesDialogOpen}
                    teamsToRelavancyType={teamsToRelavancyType}
                  />
                  : null}
              </TabsContent>
              <TabsContent value="skills">
                <div className="mb-10 flex flex-col justify-between xl:flex-row">
                  <h3 className="mb-5 min-w-fit font-bold text-3xl md:text-4xl">
                    Skills
                  </h3>
                  <div className="flex gap-3 sm:flex-wrap sm:flex-row flex-nowrap flex-col">
                    <select
                      className="h-8 min-w-max rounded-lg bg-white pl-2 text-sm text-black sm:w-44 md:h-12 md:w-52 md:text-lg"
                      required
                      value={skillsSort}
                      onChange={(event) => {
                        setSkillsSort(event.target.value as "total" | "prog" | "driver");
                      }}
                    >
                      <option value="total">Total</option>
                      <option value="prog">Prog</option>
                      <option value="driver">Driver</option>
                    </select>
                    <div className="relative min-w-max">
                      <input
                        className="h-8 w-full rounded-lg bg-white p-3 text-sm text-black sm:w-44 md:h-12 md:w-52 md:text-lg"
                        type="text"
                        value={teamNumberFilter}
                        placeholder="Filter by team..."
                        onChange={(e) => setTeamNumberFilter(e.target.value)}
                      />
                      <TiDeleteOutline
                        className="absolute right-2 top-2 text-lg cursor-pointer text-black"
                        onClick={() => setTeamNumberFilter("")}
                      />
                    </div>
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
                <div className="flex flex-col gap-1 overflow-auto w-[100%]">
                  {skillsRanked.length !== 0 ? skillsRanked.map((result: CombinedTeamSkills) => {
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
                <div className="mb-5 flex flex-col justify-between xl:flex-row">
                  <h3 className="mb-5 min-w-fit font-bold text-3xl md:text-4xl">
                    Awards
                  </h3>
                  <div className="flex gap-3 sm:flex-wrap sm:flex-row flex-nowrap flex-col">
                    <div className="relative min-w-max">
                      <input
                        className="h-8 w-full rounded-lg bg-white p-3 text-sm text-black sm:w-44 md:h-12 md:w-52 md:text-lg"
                        type="text"
                        value={teamNumberFilter}
                        placeholder="Filter by team..."
                        onChange={(e) => setTeamNumberFilter(e.target.value)}
                      />
                      <TiDeleteOutline
                        className="absolute right-2 top-2 text-lg cursor-pointer text-black"
                        onClick={() => setTeamNumberFilter("")}
                      />
                    </div>
                  </div>
                </div>
                <p className="mb-10 text-sm font-semibold">
                  We recommend using <button
                    className="text-blue-500"
                    onClick={async () => {
                      await navigator.clipboard.writeText(eventCode);
                      window.open(
                        `https://bren.app/excellence`,
                        "_blank"
                      );
                    }}
                  >
                    bren.app/excellence
                  </button> by Brendan McGuire to see excellence eligible teams at the moment. Clicking the
                  link will copy the event code to your clipboard.
                </p>
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
        </> : eventDataIsLoading ? <>
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold text-neutral-200">
              Loading...
            </h1>
            <div className="w-20 h-20 mt-5 flex items-center justify-center">
              <Spinner/>
            </div>
          </div>
        </>
        : <div className="flex flex-col items-center justify-center">
            <h1 className="italic text-3xl font-bold text-neutral-200">
              Event not found
              <FaRegSadTear className="inline-block ml-2"/>
            </h1>
          </div>
        }
      </div>
    </main>
  )
}