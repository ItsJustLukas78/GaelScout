"use client"
import React, {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {Event, EventAward, TeamProfile, TeamSeasonProfile} from "@/app/types";
import {GiDiamondTrophy, GiNotebook} from "react-icons/gi";
import TeamNotesDialog from "@/components/TeamNotesDialog";
import {useUser} from "@clerk/nextjs";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import EventResult from "@/components/EventResult";
import {AiFillStar, AiOutlineStar} from "react-icons/ai";
import {FaAward, FaLaptopCode, FaLightbulb, FaSadCry, FaTrophy} from "react-icons/fa";
import {BiCool} from "react-icons/bi";
import {MdBuild, MdCelebration, MdEngineering, MdEventNote, MdSupervisorAccount} from "react-icons/md";
import {IoStatsChart} from "react-icons/io5";
import {IsPWA} from "@/components/IsPWA";
import Spinner from "@/components/Spinner";
import useSWR from 'swr'
import {TbNotebook, TbNumbers} from "react-icons/tb";
import {useGlobalStore} from "@/state/globalState";


const SWROptions = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  refreshWhenHidden: false,
  refreshWhenOffline: false,
}

const awardIcons = {
  "Excellence Award": <GiDiamondTrophy className="mt-1 h-10 w-10"/>,
  "Tournament Champions": <FaTrophy className="mt-1 h-10 w-10"/>,
  "Design Award": <TbNotebook className="mt-1 h-10 w-10"/>,
  "Judges Award": <MdSupervisorAccount className="mt-1 h-10 w-10"/>,
  "Skills Champion": <TbNumbers className="mt-1 h-10 w-10"/>,
  "Robot Skills Champion": <TbNumbers className="mt-1 h-10 w-10"/>,
  "Think Award": <FaLaptopCode className="mt-1 h-10 w-10"/>,
  "Amaze Award": <BiCool className="mt-1 h-10 w-10"/>,
  "Build Award": <MdBuild className="mt-1 h-10 w-10"/>,
  "Create Award": <MdEngineering className="mt-1 h-10 w-10"/>,
  "Innovate Award": <FaLightbulb className="mt-1 h-10 w-10"/>,
  "Sportsmanship Award": <MdCelebration className="mt-1 h-10 w-10"/>,
};

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

export default function TeamProfile({params}: { params: { slug: [] } }) {
  const inputTeamRef = React.useRef<HTMLInputElement>(null);
  const isPWA = IsPWA();

  const addRecentlyViewedTeam = useGlobalStore(state => state.addRecentlyViewedTeam);
  const hasHydrated = useGlobalStore(state => state._hasHydrated);

  const {isSignedIn} = useUser();

  const teamNumber = params.slug?.at(0) as undefined | string

  const [teamNumberInput, setTeamNumberInput] = useState<string>(teamNumber ? teamNumber.toUpperCase() : "");

  const [teamProfile, setTeamProfile] = useState<TeamProfile | null>(null);
  const [seasonStats, setSeasonStats] = useState<TeamSeasonProfile | null>(null);
  const [seasonId, setSeasonId] = useState<number>(190);

  const [teamNotesDialogOpen, setTeamNotesDialogOpen] = useState<boolean>(false);

  const [currentEvents, setCurrentEvents] = useState<Event[]>([]);
  const [currentAwards, setCurrentAwards] = useState<EventAward[]>([]);

  const [loadingProfile, setLoadingProfile] = useState<boolean>(false);
  const [loadingSeasonStats, setLoadingSeasonStats] = useState<boolean>(false);

  const [favorited, setFavorited] = useState<boolean>(false);

  const [placeholder, setPlaceholder] = useState<string>("Type Here...");
  const placeHolderPhrases = ["5327A", "606X", "229V", "11101B", "Type Here"];

  const returnAwardIcon = (awardName: string) => {
    let icon = <FaAward className="mt-1 h-10 w-10"/>;

    Object.keys(awardIcons).forEach((key: any) => {
      if (awardName.startsWith(key)) {
        // @ts-ignore
        icon = awardIcons[key];
      }
    });

    return icon;
  }

  useEffect(() => {
    let isMounted = true;

    const animatedPlaceholder = async () => {
      while (isMounted) {
        for (let i = 0; i < placeHolderPhrases.length; i++) {
          const phrase = placeHolderPhrases[i] + "...";
          await new Promise(resolve => setTimeout(resolve, 6000));
          setPlaceholder("");
          for (let j = 0; j < phrase.length; j++) {
            await new Promise(resolve => setTimeout(resolve, 100));
            setPlaceholder(prevPlaceholder => phrase.substring(0, j + 1));
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    };

    animatedPlaceholder();

    return () => {
      isMounted = false;
    };
  }, []);

  const getTeam = async (controler: AbortController) => {
    try {
      if (!teamNumberInput || teamNumberInput == "") {
        return;
      }
      setLoadingProfile(true);
      const response = await fetch(`/api/teams/number/${teamNumberInput.toUpperCase()}`, {
        signal: controler.signal,
      });

      const data = await response.json()

      if (data.error) {
        // toast.error(data.error)
        console.log(data.error);
        setTeamProfile(null);
        setLoadingProfile(false);
        return;
      }

      setTeamProfile(data.team)
      setLoadingProfile(false);

      if (hasHydrated) {
        addRecentlyViewedTeam(data.team);
      }
    } catch (err) {
      toast.error(err as any)
      setLoadingProfile(false);
    }
  }

  const getSeasonStats = async (controller: AbortController) => {
    try {
      if (!teamNumberInput || teamNumberInput == "") {
        return;
      }
      setLoadingSeasonStats(true);
      const response = await fetch(`/api/seasons/${seasonId}/seasonProfile/${teamNumberInput.toUpperCase()}`, {
        signal: controller.signal,
      });

      const data = await response.json();

      if (data.error) {
        console.log(data.error);
        setSeasonStats(null);
        setLoadingSeasonStats(false);
        return;
      }

      setSeasonStats(data);
      setLoadingSeasonStats(false);
    } catch (err) {
      console.log(err);
      setSeasonStats(null);
    }
  }

  const {
    data: eventsData,
    error: eventsError,
    isLoading: eventsLoading
  } = useSWR((teamProfile && seasonId) ? `/api/teams/${teamProfile.teamId}/events/?seasonId=${seasonId}` : null, fetcher, SWROptions);

  useEffect(() => {
    if (eventsError) {
      toast.error(eventsError + ": events data");
      setCurrentEvents([]);
    } else if (!eventsData) {
      setCurrentEvents([]);
    } else {
      setCurrentEvents([...eventsData.events].reverse());
    }
  }, [eventsData, eventsError]);

  const {
    data: favoriteData,
    error: favoriteError,
    isLoading: favoriteLoading
  } = useSWR((teamProfile && isSignedIn) ? `/api/favorites/?teamId=${teamProfile.teamId}&favoriteType=team` : null, fetcher, SWROptions);

  useEffect(() => {
    if (favoriteError) {
      toast.error(favoriteError + ": favorite data");
      setFavorited(false);
    } else if (!favoriteData) {
      setFavorited(false);
    } else {
      setFavorited(favoriteData.favorites.length > 0);
    }
  }, [favoriteData, favoriteError]);

  const {
    data: awardsData,
    error: awardsError,
    isLoading: awardsLoading
  } = useSWR((teamProfile && seasonId) ? `/api/teams/${teamProfile.teamId}/awards/?seasonId=${seasonId}` : null, fetcher, SWROptions);

  useEffect(() => {
    if (awardsError) {
      toast.error(awardsError + ": awards data");
    } else if (!awardsData) {
      setCurrentAwards([]);
    } else {
      setCurrentAwards(awardsData.awards);
    }
  }, [awardsData, awardsError]);


  const changeFavoriteStatus = async (favorite: boolean) => {
    if (!teamProfile) {
      return;
    }

    if (!isSignedIn) {
      toast.error("You must be signed in to favorite a team");
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
            teamId: teamProfile.teamId,
            teamNumber: teamProfile.teamNumber,
            favoriteType: "team",
          })
        });

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
            teamId: teamProfile.teamId,
            teamNumber: teamProfile.teamNumber,
            favoriteType: "team",
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

  // make sure the input has stopped for 500ms before fetching
  useEffect(() => {
    if (!teamNumberInput || teamNumberInput == "") {
      setTeamProfile(null);
      setSeasonStats(null);
      return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      getTeam(controller);
    }, 500);

    return () => {
      clearTimeout(timeout);
      controller.abort("Cancelling override fetch");
    }
  }, [teamNumberInput]);

  useEffect(() => {
    if (!teamNumberInput || teamNumberInput == "") {
      setTeamProfile(null);
      setSeasonStats(null);
      return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      getSeasonStats(controller);
    }, 500);

    return () => {
      clearTimeout(timeout);
      controller.abort("Cancelling override fetch");
    }
  }, [seasonId, teamNumberInput]);

  return (
    <div>
      <div className="flex w-full flex-col items-center justify-center overflow-hidden py-32 sm:py-32">
        <div
          className={`relative flex h-auto flex-col rounded-2xl justify-center ${teamNumberInput ? "sm:bgColorPrimary card-shine-effect" : "!w-full items-center sm:bg-none"} sm:p-8 items-left w-[340px] sm:w-[500px] md:w-[700px] lg:w-[900px] xl:w-[1200px] transition-all ease-in-out duration-1000`}>
          <div
            className={`relative ${teamNumberInput ? "[&>div]:opacity-0" : "sm:w-168 w-96 [&>div]:opacity-100 items-center"} flex flex-col justify-center [&>div]:[transition:transform_10s,opacity_1s] [&>div]:transition-opacity [&>div]:ease-in-out`}>
            <div
              className="pointer-events-none absolute top-0 left-12 h-32 w-32 rounded-full bg-purple-300 opacity-50 mix-blend-multiply blur-xl filter animate-blob sm:h-72 sm:w-72"/>
            <div
              className="pointer-events-none absolute top-0 right-12 h-32 w-32 rounded-full bg-yellow-300 opacity-50 mix-blend-multiply blur-xl filter animate-blob sm:h-72 sm:w-72"/>
            <div
              className="pointer-events-none absolute -bottom-20 h-32 w-32 rounded-full bg-green-300 opacity-50 mix-blend-multiply blur-xl filter animate-blob sm:h-72 sm:w-72"/>
            <div
              className="pointer-events-none absolute -bottom-20 h-32 w-32 rounded-full bg-white opacity-100 mix-blend-difference blur-sm filter animate-spotlight sm:h-52 sm:w-52"/>
            <input
              // type="text"
              key="teamInput"
              defaultValue={teamNumberInput}
              placeholder={placeholder}
              ref={inputTeamRef}
              className={`${teamNumberInput ? "outlinedText" : "text-center mt-10"} mb-5 border-none bg-transparent text-4xl font-bold outline-none xs:text-5xl sm:text-8xl placeholder-white placeholder-opacity-100`}
              onChange={(event) => {
                event.preventDefault();
                window.history.pushState({}, '', `/teams/${event.target.value.toUpperCase()}`);
                setTeamNumberInput(event.target.value.toUpperCase());
              }}
            >
            </input>
            <hr className={`border-2 border-gray-500 w-3/4 sm:w-5/6 ${teamNumberInput ? "opacity-0" : "opacity-100"}`}/>
          </div>
          {teamProfile ? <>
            <div className="absolute max-w-max top-0.5 right-0.5 outlinedText sm:top-4 sm:right-4">
              <button
                className="flex items-center justify-center text-2xl font-extrabold min-w-[50px] min-h-[50px]"
                onClick={(e) => {
                  e.preventDefault()
                  if (isSignedIn) {
                    changeFavoriteStatus(!favorited);
                    return;
                  } else {
                    toast.error("You must be signed in to favorite a team");
                  }
                }}
              >
                {favorited ? <AiFillStar className="inline-block"/> : <AiOutlineStar className="inline-block"/>}
              </button>
            </div>
            <div
              className={`outlinedText flex flex-col mb-5 text-xl ease-in-out [transition:transform_1s,opacity_1s,color_0.01s] ${teamNumberInput ? "opacity-100" : "opacity-0 translate-x-full"}`}>
              <a href={`https://www.robotevents.com/teams/VRC/${teamNumberInput.toUpperCase()}`}
                 className="mb-5 max-w-fit text-lg font-bold hover:text-blue-500 xs:text-xl">
                <u>RobotEvents Page</u>
              </a>
              <div className="flex flex-col gap-5 min-w-auto xl:flex-row xl:gap-14">
                <div className="flex flex-row gap-5 xl:w-[30%] xl:flex-col">
                  <div className="flex flex-col w-[49%] xl:w-auto">
                    <h3 className="text-xl font-bold">
                      Name:
                    </h3>
                    <h3 className="font-normal text-md">
                      {teamProfile.teamName ? teamProfile.teamName : "N/A"}
                    </h3>
                  </div>
                  <div className="flex flex-col truncate w-[49%] xl:w-auto">
                    <h3 className="text-xl font-bold">
                      Robot Name:
                    </h3>
                    <h3 className="font-normal text-md">
                      {teamProfile.robotName ? teamProfile.robotName : "N/A"}
                    </h3>
                  </div>
                </div>
                <div className="flex flex-row gap-5 xl:w-[30%] xl:flex-col">
                  <div className="flex flex-col w-[49%] xl:w-auto">
                    <h3 className="text-xl font-bold">
                      Org:
                    </h3>
                    <h3 className="font-normal text-md">
                      {teamProfile.teamOrg ? (
                        teamProfile.teamOrg.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')
                      ) : "N/A"}
                    </h3>
                  </div>
                  <div className="flex flex-col w-[49%] xl:w-auto">
                    <h3 className="text-xl font-bold">
                      Location:
                    </h3>
                    <h3 className="font-normal text-md">
                      {teamProfile.teamCity ? teamProfile.teamCity + ", " : ""}{teamProfile.teamRegion ? teamProfile.teamRegion + ", " : ""}{teamProfile.teamCountry ? teamProfile.teamCountry : ""}
                    </h3>
                  </div>
                </div>
                <div className="flex flex-row gap-5 xl:w-[30%] xl:flex-col">
                  <div className="flex flex-col w-[49%] xl:w-auto">
                    <h3 className="text-xl font-bold">
                      Program:
                    </h3>
                    <h3 className="font-normal text-md">
                      {teamProfile.programCode ? teamProfile.programCode : "N/A"}
                    </h3>
                  </div>
                  <div className="flex flex-col w-[49%] xl:w-auto">
                    <h3 className="text-xl font-bold">
                      Grade:
                    </h3>
                    <h3 className="font-normal text-md">
                      {teamProfile.teamGrade ? teamProfile.teamGrade : "N/A"}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </> : loadingProfile ? <h3 className="mb-5 text-xl opacity-100 transition-all duration-1000 ease-in-out">
              Loading Team Profile... <Spinner className="inline-block !h-5 !w-5"/>
            </h3> :
            <h3
              className={`mb-5 text-xl transition-all ease-in-out duration-1000 ${teamNumberInput ? "opacity-100" : "opacity-0 translate-x-full"}`}>
              Team Profile Not Found
            </h3>
          }
        </div>
        <hr
          className={`sm:hidden block my-8 w-11/12 border-t-2 border-neutral-500 ${teamNumberInput ? "opacity-100" : "opacity-0"}`}/>
        <Tabs defaultValue="statistics">
          <TabsList
            className={`fixed sm:relative z-30 sm:z-0 ${isPWA ? "bottom-[4.5rem]" : "bottom-[3rem]"} sm:bottom-0 left-0 px-2 pb-7 sm:pb-0 sm:bgColorPrimary sm:h-10 transition-all ease-in-out duration-1000 ${teamNumberInput ? "opacity-100" : `opacity-0`} h-[60px] flex w-full sm:w-min sm:min-w-[500px] md:min-w-[700px] lg:min-w-[900px] xl:min-w-[1200px] sm:my-8 [&>*]:flex-1 bg-gradient-to-b
   sm:to-[var(--color-primary-hover)] sm:from-[var(--color-primary)] to-neutral-800 from-GSGray`}>
            <TabsTrigger value="statistics" className="flex h-14 flex-col text-2xs sm:h-8 sm:flex-row">
              <IoStatsChart className="inline-block text-lg sm:mr-2"/>
              Season Stats
            </TabsTrigger>
            <TabsTrigger value="events" className="flex h-14 flex-col text-2xs sm:h-8 sm:flex-row">
              <MdEventNote className="inline-block text-lg sm:mr-2"/>
              Events
            </TabsTrigger>
          </TabsList>
          <div
            className={`relative flex h-auto flex-col justify-center rounded-2xl sm:bgColorPrimary sm:p-8 mb-10 items-left w-[340px] sm:w-[500px] md:w-[700px] lg:w-[900px] xl:w-[1200px] transition-all ease-in-out duration-1000 ${teamNumberInput ? "opacity-100" : "opacity-0 -translate-x-full"}`}>
            <TabsContent value="statistics">
              <div className="mb-10 flex flex-col outlinedText md:flex-row">
                <h3 className="mb-5 min-w-fit text-3xl font-bold md:text-4xl">
                  Season Statistics
                </h3>
                <div className="flex flex-row gap-3 md:ml-auto">
                  <select
                    className="h-10 w-48 rounded-lg p-3 text-sm text-black sm:h-12 sm:w-52 md:ml-auto lg:w-80"
                    required
                    value={seasonId}
                    onChange={(event) => setSeasonId(parseInt(event.target.value))}
                  >
                    <option value="173">Spin Up 2022-23</option>
                    <option value="181">Over Under 2023-24</option>
                    <option value="190">High Stakes 2024-25</option>
                  </select>
                  <button
                    className="flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-neutral-50 text-xl font-semibold text-black opacity-50 min-w-[50px] disabled:opacity-50 sm:h-12"
                    onClick={(e) => {
                      e.preventDefault()
                      if (isSignedIn) {
                        setTeamNotesDialogOpen(true)
                        return;
                      } else {
                        toast.error("You must be signed in to view team notes");
                      }
                    }}
                  >
                    <GiNotebook className="inline-block"/>
                  </button>
                </div>
              </div>
              {seasonStats ? <>
                <div className="flex flex-row flex-wrap justify-center gap-5 outlinedText sm:mx-2 md:justify-between">
                  <div
                    className="flex w-full flex-col gap-5 rounded-lg p-3 pb-5 bgColorSecondary md:w-[47%] xl:w-[49%]">
                    <div className="relative flex flex-row justify-between outlinedText">
                      <h3
                        className={`text-xl font-bold ${seasonStats.opr ? seasonStats.opr > 40 ? "goodGradient" : seasonStats.opr < 25 ? "badGradient" : "midGradient" : ""}`}>
                        OPR:
                      </h3>
                      <h3
                        className={`text-xl ${seasonStats.opr ? seasonStats.opr > 40 ? "goodGradient" : seasonStats.opr < 25 ? "badGradient" : "midGradient" : ""}`}>
                        {seasonStats.opr != undefined ? seasonStats.opr.toFixed(4) : "N/A"}
                      </h3>
                      <p className="absolute -bottom-1/2 left-0 text-gray-300 text-2xs">
                        Avg. Contrib. To Score
                      </p>
                    </div>
                    <hr/>
                    <div className="relative flex flex-row justify-between outlinedText">
                      <h3
                        className={`text-xl font-bold ${seasonStats.dpr ? seasonStats.dpr < 25 ? "goodGradient" : seasonStats.dpr > 40 ? "badGradient" : "midGradient" : ""}`}>
                        DPR:
                      </h3>
                      <h3
                        className={`text-xl ${seasonStats.dpr ? seasonStats.dpr < 25 ? "goodGradient" : seasonStats.dpr > 40 ? "badGradient" : "midGradient" : ""}`}>
                        {seasonStats.dpr != undefined ? seasonStats.dpr.toFixed(4) : "N/A"}
                      </h3>
                      <p className="absolute -bottom-1/2 left-0 text-gray-300 text-2xs">
                        Avg. Contrib. To Opponent Score
                      </p>
                    </div>
                    <hr/>
                    <div className="relative flex flex-row justify-between outlinedText">
                      <h3
                        className={`text-xl font-bold ${seasonStats.ccwm ? seasonStats.ccwm > 30 ? "goodGradient" : seasonStats.ccwm < 15 ? "badGradient" : "midGradient" : ""}`}>
                        CCWM:
                      </h3>
                      <h3
                        className={`text-xl ${seasonStats.ccwm ? seasonStats.ccwm > 30 ? "goodGradient" : seasonStats.ccwm < 15 ? "badGradient" : "midGradient" : ""}`}>
                        {seasonStats.ccwm != undefined ? seasonStats.ccwm.toFixed(4) : "N/A"}
                      </h3>
                      <p className="absolute -bottom-1/2 left-0 text-gray-300 text-2xs">
                        OPR - DPR
                      </p>
                    </div>
                  </div>
                  <div
                    className="flex w-full flex-col gap-5 rounded-lg p-3 pb-5 bgColorSecondary md:w-[47%] xl:w-[49%]">
                    <div className="relative flex flex-row justify-between outlinedText">
                      <h3 className="text-xl font-bold">
                        OpenSkill:
                      </h3>
                      <h3 className="text-xl">
                        {seasonStats.openSkill != undefined ? seasonStats.openSkill.toFixed(2) : "N/A"}
                      </h3>
                      <p className="absolute -bottom-1/2 left-0 text-gray-300 text-2xs">
                        &quot;Robot ELO&quot; - Based on won against/lost to
                      </p>
                    </div>
                    <hr/>
                    <div className="flex flex-row justify-between outlinedText">
                      <h3 className="text-xl font-bold">
                        OpenSkill Rank:
                      </h3>
                      <h3 className="text-xl">
                        {seasonStats.openSkillRank != undefined ? seasonStats.openSkillRank : "N/A"}
                      </h3>
                      <p className="absolute -bottom-1/2 left-0 text-gray-300 text-2xs">
                        Ranking against all match-participating teams
                      </p>
                    </div>
                  </div>
                  <div
                    className="flex w-full flex-col gap-5 rounded-lg p-3 pb-5 bgColorSecondary md:w-[47%] xl:w-[49%]">
                    <div className="flex flex-row justify-between outlinedText">
                      <h3 className="text-xl font-bold">
                        Qual Win:
                      </h3>
                      <h3 className="text-xl">
                        {seasonStats.qualMatchWinPercentage != undefined ? `${seasonStats.qualMatchWinPercentage.toFixed(2)}%` : "N/A"}
                      </h3>
                      <p className="absolute -bottom-1/2 left-0 text-gray-300 text-2xs">
                        How often Qualification Matches are won
                      </p>
                    </div>
                    <hr/>
                    <div className="flex flex-row justify-between outlinedText">
                      <h3 className="text-xl font-bold">
                        Elim Win:
                      </h3>
                      <h3 className="text-xl">
                        {seasonStats.elimMatchWinPercentage != undefined ? `${seasonStats.elimMatchWinPercentage.toFixed(2)}%` : "N/A"}
                      </h3>
                      <p className="absolute -bottom-1/2 left-0 text-gray-300 text-2xs">
                        How often Elimination Matches are won
                      </p>
                    </div>
                    <hr/>
                    <div className="flex flex-row justify-between outlinedText">
                      <h3 className="text-xl font-bold">
                        Event Count:
                      </h3>
                      <h3 className="text-xl">
                        {seasonStats.eventCount != undefined ? seasonStats.eventCount : "N/A"}
                      </h3>
                      <p className="absolute -bottom-1/2 left-0 text-gray-300 text-2xs">
                        Number of Events Attended
                      </p>
                    </div>
                  </div>
                  <div
                    className="flex w-full flex-col gap-5 rounded-lg p-3 pb-5 bgColorSecondary md:w-[47%] xl:w-[49%]">
                    <div className="relative flex flex-row justify-between outlinedText">
                      <h3 className="text-xl font-bold">
                        Skills:
                      </h3>
                      <h3 className="text-xl">
                        {seasonStats.totalSkills != undefined ? seasonStats.totalSkills : "N/A"}
                      </h3>
                      <p className="absolute -bottom-1/2 left-0 text-gray-300 text-2xs">
                        Official Skills Score
                      </p>
                    </div>
                    <hr/>
                    <div className="flex flex-row justify-between outlinedText">
                      <h3 className="text-xl font-bold">
                        Skills Rank:
                      </h3>
                      <h3 className="text-xl">
                        {seasonStats.skillsRank != undefined ? seasonStats.skillsRank : "N/A"}
                      </h3>
                      <p className="absolute -bottom-1/2 left-0 text-gray-300 text-2xs">
                        Ranking against all skill-participating teams
                      </p>
                    </div>
                    <hr/>
                    <div className="flex flex-row justify-between outlinedText">
                      <h3 className="text-xl font-bold">
                        Driver:
                      </h3>
                      <h3 className="text-xl">
                        {seasonStats.driverSkills != undefined ? seasonStats.driverSkills : "N/A"}
                      </h3>
                      <p className="absolute -bottom-1/2 left-0 text-gray-300 text-2xs">
                        Score from Human-Driven Skills
                      </p>
                    </div>
                    <hr/>
                    <div className="flex flex-row justify-between outlinedText">
                      <h3 className="text-xl font-bold">
                        Program:
                      </h3>
                      <h3 className="text-xl">
                        {seasonStats.progSkills != undefined ? seasonStats.progSkills : "N/A"}
                      </h3>
                      <p className="absolute -bottom-1/2 left-0 text-gray-300 text-2xs">
                        Score from automated skills through programming
                      </p>
                    </div>
                  </div>
                  {currentAwards ?
                    <div
                      className="flex w-full flex-col gap-5 rounded-lg p-3 pb-5 bgColorSecondary md:w-[47%] xl:w-[49%]">
                      <div className="relative flex flex-row justify-between outlinedText">
                        <h3 className="text-xl font-bold">
                          Regionals Qual:
                        </h3>
                        <h3 className="text-xl">
                          {currentAwards.some((award: EventAward) => award.qualification == "Event Region Championship") ? "Yes" : "No"}
                        </h3>
                        <p className="absolute -bottom-1/2 left-0 text-gray-300 text-2xs">
                          Qualifies to Regionals
                        </p>
                      </div>
                      <hr/>
                      <div className="relative flex flex-row justify-between outlinedText">
                        <h3 className="text-xl font-bold">
                          Worlds Qual:
                        </h3>
                        <h3 className="text-xl">
                          {currentAwards.some((award: EventAward) => award.qualification == "World Championship") ? "Yes" : "No"}
                        </h3>
                        <p className="absolute -bottom-1/2 left-0 text-gray-300 text-2xs">
                          Qualifies to Worlds and is Registered
                        </p>
                      </div>
                    </div>
                    : null
                  }
                  {/* display list of awards */}
                  <div
                    className="flex w-full flex-col gap-5 rounded-lg p-3 pb-5 bgColorSecondary md:w-[47%] xl:w-[49%]">
                    <h3 className="text-xl font-bold outlinedText">
                      Awards:
                    </h3>
                    <div className="flex h-60 flex-col gap-5 overflow-auto pr-4 outlinedText">
                      {currentAwards.length !== 0 && currentAwards.map((award: EventAward) => {
                        return <>
                          <div key={award.id + award.order} className="flex flex-row gap-2">
                            <div className="flex flex-col gap-2">
                              {returnAwardIcon(award.name)}
                            </div>
                            <div className="flex flex-col gap-2">
                              <h1 className="mb-2 text-sm font-extrabold md:text-lg">
                                {award.name}
                              </h1>
                              <h2 className="text-xs font-medium md:text-sm">
                                <span className="font-bold">Event:</span> {award.eventName}
                              </h2>
                              <h2 className="text-xs font-medium md:text-sm">
                                <span className="font-bold">Qualifications:</span> {award.qualification ?? 'N/A'}
                              </h2>
                            </div>
                          </div>
                          <hr className="w-full border-neutral-500"/>
                        </>
                      })}
                      {currentAwards.length === 0 ?
                        <h3 className="text-center text-sm font-medium italic">
                          No Awards <FaSadCry className="inline-block"/>
                        </h3> : null
                      }
                    </div>
                  </div>
                </div>
                {isSignedIn ?
                  <TeamNotesDialog
                    teamNotesDialogOpen={teamNotesDialogOpen}
                    currentNotesTeam={teamProfile}
                    seasonId={seasonId}
                    setTeamNotesDialogOpen={setTeamNotesDialogOpen}
                  />
                  : null}
              </> : loadingSeasonStats ? <h3 className="mx-2 text-xl">
                  Loading Season Profile... <Spinner className="inline-block !h-5 !w-5"/>
                </h3> :
                <h3 className="mx-2 text-xl">
                  Season Profile Not Found
                </h3>
              }
            </TabsContent>
            <TabsContent value="events">
              <div className="mb-10 flex flex-col justify-between outlinedText md:flex-row">
                <h3 className="mb-5 min-w-fit text-3xl font-bold md:text-4xl">
                  Events
                </h3>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <select
                    className="h-10 w-48 rounded-lg p-3 text-sm text-black sm:h-12 sm:w-52 md:ml-auto lg:w-80"
                    required
                    value={seasonId}
                    onChange={(event) => setSeasonId(parseInt(event.target.value))}
                  >
                    <option value="173">Spin Up 2022-23</option>
                    <option value="181">Over Under 2023-24</option>
                    <option value="190">High Stakes 2024-25</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-4 p-1 w-[100%]">
                {currentEvents.length !== 0 && currentEvents.map((result: Event) => {
                    const locationString = `${result.location?.venue ? result.location?.venue + ' @ ' : ''}${result.location?.city ? result.location?.city + ", " : ""}${result.location?.region ? result.location?.region + ", " : ""}${result.location?.country}`;

                    return (
                      <EventResult
                        key={result.id}
                        id={result.id}
                        sku={result.sku}
                        name={result.name}
                        start={result.start}
                        location={locationString}
                        dark={false}
                        defaultTeam={teamProfile ? teamProfile.teamNumber : ""}
                      />
                    )
                  }
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
