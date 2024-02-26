"use client"
import React, { useState, useEffect } from "react";
import {IsPWA} from "@/components/IsPWA"
import { MdSearch } from "react-icons/md";
import {Event, TeamProfile} from "@/app/types";
import {useSpring, animated} from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import LoadMore from "@/components/LoadMore";
import TeamResult from "@/components/TeamResult";
import {toast} from "react-toastify";
import {useGlobalStore} from "@/state/globalState";
import EventResult from "@/components/EventResult";
import useSWR from 'swr'
import {useUser} from "@clerk/nextjs";
import {TiDeleteOutline} from "react-icons/ti";

import { usePathname } from 'next/navigation'


const SWROptions = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  refreshWhenHidden: false,
  refreshWhenOffline: false,
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


export default function MobileSearch() {
  const {isLoaded, isSignedIn, user} = useUser();
  const isPWA = IsPWA();

  const recentlyViewedTeams = useGlobalStore(state => state.recentlyViewedTeams);

  enum TabType {
    TEAMS="TEAMS",
    EVENTS="EVENTS",
    FAVORITES="FAVORITES"
  }

  const [activeTab, setActiveTab] = useState<TabType>(TabType.TEAMS);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  }

  const [{ x, y }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    immediate: true,
    config: { mass: 500, tension: 0, friction: 0 },
  }))

  const [expanded, setExpanded] = useState(false);

  const searchBarRef = React.useRef(null);

  const [searchButtonEnabled, setSearchButtonEnabled] = useState(true);

  const bind = useDrag(({ down, movement: [mx, my] }) => {
    if (my < -5 && expanded) {
      my = -5;
    }

    if (my > 0 && !expanded) {
      my = 0;
    }

    api.start({ x: down ? mx : 0, y: down ? my : 0 })

    if (down && my > 20) {
      setExpanded(false);
      setTimeout(() => {
        setSearchButtonEnabled(true);
      }, 1000);
    } else if (down && my < -5) {
      setExpanded(true);
      setSearchButtonEnabled(false);
    }
  })

  useEffect(() => {
    setSearchButtonEnabled(true);
    setExpanded(false);
  }, []);

  const [currentSearch, setCurrentSearch] = useState<string>("");

  const [teamResults, setTeamResults] = useState<TeamProfile[]>([]);
  const [favoriteResults, setFavoriteResults] = useState<{teams: TeamProfile[], events: Event[]}>({teams: [], events: []});

  const [currentTeamsPage, setCurrentTeamsPage] = useState<number>(1);
  const [currentEventsPage, setCurrentEventsPage] = useState<number>(1);

  const [loadingTeams, setLoadingTeams] = useState<boolean>(false);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(false);

  const [seasonId, setSeasonId] = useState<number>(181);

  const getTeams = async (page: number, append: boolean) => {
    setLoadingTeams(true);
    setCurrentTeamsPage(page);

    const searchParams = new URLSearchParams();
    searchParams.append("page", page.toString());
    searchParams.append("fuzzySearch", currentSearch);

    const response = await fetch(`/api/teams?${searchParams.toString()}`);
    const data = await response.json();
    if (append) {
      setTeamResults([...teamResults, ...data.data]);
    } else {
      setTeamResults(data.data);
    }
    setLoadingTeams(false);
  }

  const seasonToEvents = useGlobalStore(state => state.seasonToEvents);
  const setSeasonToEvents = useGlobalStore(state => state.setSeasonToEvents);

  const seasonToEventsAge = useGlobalStore(state => state.seasonToEventsAge);
  const setSeasonToEventsAge = useGlobalStore(state => state.setSeasonToEventsAge);

  const [seasonEvents, setSeasonEvents] = useState<Event[]>([]);

  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);

  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [displayedEvents, setDisplayedEvents] = useState<Event[]>([]);

  const getEvents = async () => {
    setLoadingTeams(true);
    try {
      const searchParams = new URLSearchParams();
      searchParams.append("seasonId", seasonId.toString());

      const response = await fetch(`/api/events?${searchParams.toString()}`);
      const data = await response.json();

      if (data.error) {
        console.error(data.error);
        toast.error(data.error);
        return;
      }

      setSeasonToEvents(seasonId, data.events);
      setSeasonEvents(data.events);
      setSeasonToEventsAge(seasonId, new Date());
    } catch (error) {
      console.error(error);
    }
  }

   useEffect(() => {
    if (seasonEvents.length > 0) {
      const upcomingEvents = seasonEvents.filter((event: Event) => {
        return (new Date(event.start)).getTime() > (Date.now() - (1000 * 60 * 60 * 24 * 4));
      });
      setUpcomingEvents(upcomingEvents);
    }
  }, [seasonEvents]);

  const hasHydrated = useGlobalStore(state => state._hasHydrated);

  useEffect(() => {
    if (!expanded) {
      return;
    }

    setLoadingTeams(true);

    if (!hasHydrated) {
      return;
    }

    if (seasonToEvents[seasonId] === undefined || seasonToEvents[seasonId].length === 0) {
      getEvents();
    } else if (seasonToEvents[seasonId] !== undefined) {
      const lastDateUpdated = seasonToEventsAge[seasonId];
      const currentDate = new Date();
      const timeDifference = currentDate.getTime() - new Date(lastDateUpdated).getTime();

      // six hours
      if (timeDifference > (6 * 1000 * 60 * 60)) {
        getEvents();
      } else {
        setSeasonEvents(seasonToEvents[seasonId]);
      }
    }
  }, [seasonId, hasHydrated, expanded]);

  const increaseEventsShown = () => {
    setDisplayedEvents(filteredEvents.slice(0, (currentEventsPage + 1) * 15));
    setCurrentEventsPage(currentEventsPage + 1);
    setLoadingEvents(false);
  }

  useEffect(() => {
    setDisplayedEvents(filteredEvents.slice(0, 15));
    setCurrentEventsPage(1);
    setLoadingEvents(false);
  }, [filteredEvents]);

  useEffect(() => {
    if (activeTab === TabType.TEAMS) {
      if (currentSearch.length > 0 && currentSearch.trim().length > 0) {
        getTeams(1, false);
      } else {
        setTeamResults([]);
      }
    } else if (activeTab === TabType.EVENTS) {
      let filteredEvents: Event[] = [];

      if (currentSearch.length > 0 && currentSearch.trim().length > 0) {
        filteredEvents = seasonEvents;

        filteredEvents = filteredEvents.filter((event: Event) => {
          return event.name.toUpperCase().includes(currentSearch.toUpperCase()) || event.sku.toUpperCase().includes(currentSearch.toUpperCase());
        });
      } else {
        filteredEvents = upcomingEvents;
      }

      setFilteredEvents(filteredEvents);
    }
  }, [currentSearch, activeTab]);

  const { data: favoriteTeamsData, error: favoriteTeamsError, isLoading: favoriteTeamsIsLoading } = useSWR(expanded && isSignedIn ? `/api/favorites?favoriteType=team` : null, fetcher, SWROptions);
  const { data: favoriteEventsData, error: favoriteEventsError, isLoading: favoriteEventsIsLoading } = useSWR(expanded && isSignedIn ? `/api/favorites?favoriteType=event` : null, fetcher, SWROptions);

  useEffect(() => {
    if (favoriteTeamsData) {
      favoriteTeamsData.favorites.sort((a: TeamProfile, b: TeamProfile) => {
        return a.teamNumber.localeCompare(b.teamNumber);
      });

      setFavoriteResults((prevState) => {
        return {
          ...prevState,
          teams: favoriteTeamsData.favorites
        }
      });
    }
  }, [favoriteTeamsData]);

  useEffect(() => {
    if (favoriteEventsData) {
      favoriteEventsData.favorites.sort((a: Event, b: Event) => {
        return new Date(a.start).getTime() - new Date(b.start).getTime();
      });

      setFavoriteResults((prevState) => {
        return {
          ...prevState,
          events: favoriteEventsData.favorites
        }
      });
    }
  }, [favoriteEventsData]);

  // check if the page has tabs or not (on team or event page)
  const pathname = usePathname();

  useEffect(() => {
    setExpanded(false);
  }, [pathname]);

  return (
    <div>
      <div
        className={`fixed w-full h-[15%] z-40 left-0 top-0 ${expanded ? "block" : "hidden"}`}
        onClick={() => setExpanded(false)}
      />
        <animated.div
          style={{ y, touchAction: 'none' }}
          className={`sm:hidden flex fixed w-full h-[85%] z-40 left-0 transition-all ease-in-out duration-1000 border-t-[1px] ${expanded ? "bottom-0 border-transparent" : `${isPWA ? "bottom-[calc(-85%+4rem)]" : "bottom-[calc(-85%+3rem)]"} border-neutral-600 border-opacity-100`}`}
        >
          <div className={`flex flex-col w-full h-full bgColorPrimary ${expanded ? "rounded-t-3xl" : ""}`}>
            <animated.div
              {...bind()}
              className={`relative flex justify-center w-full h-20 rounded-t-3xl touch-none`}
            >
              <MdSearch className={`h-6 w-6 text-white m-2 absolute pointer-events-none ${expanded ? "left-6 top-5" : "top-1.5"}`} />
              <input
                ref={searchBarRef}
                type="text"
                className={`rounded-3xl bg-neutral-900 text-[16px] text-left pl-12 p-4 transition-all duration-300 ${expanded ? "w-full m-4 text-white h-12" : "h-8 m-2 w-20 cursor-pointer text-transparent"}`}
                placeholder={expanded ? "Search for teams or events" : ""}
                value={currentSearch}
                disabled={!searchButtonEnabled && !expanded}
                onChange={(e) => {
                  setCurrentSearch(e.target.value);
                }}
                onClick={() => {
                  if (searchButtonEnabled) {
                    setExpanded(true);
                  }
                }}
              />
              <TiDeleteOutline
                className={`absolute right-8 top-[30px] text-xl cursor-pointer text-white transition-all duration-300 ${expanded ? "block" : "hidden"}`}
                onClick={() => setCurrentSearch("")}
              />
              <button
                className={`absolute h-12 w-12 rounded-3xl bg-transparent text-white transition-all duration-300 ${expanded ? "hidden" : "block m-2 w-20"}`}
                onClick={async () => {
                  if (searchButtonEnabled) {
                    setExpanded(!expanded)
                    //wait for the animation to finish
                    await new Promise(r => setTimeout(r, 500));

                    if (searchBarRef.current) {
                      // @ts-ignore
                      searchBarRef.current.focus();
                    }
                  }
                }}
              >
              </button>
            </animated.div>
            {/*tabs for teams and events and favorites*/}
            <div className={`mt-2 text-sm flex flex-row w-full h-min border-b-2 border-b-neutral-500 ${expanded ? "" : "opacity-0"}`}>
              <button
                className={`w-20 h-6 text-white transition-all duration-100 ${activeTab === TabType.TEAMS ? "border-b-2" : ""}`}
                onClick={() => handleTabChange(TabType.TEAMS)}
              >
                Teams
              </button>
              <button
                className={`w-20 h-6 text-white transition-all duration-100 ${activeTab === TabType.EVENTS ? "border-b-2" : ""}`}
                onClick={() => handleTabChange(TabType.EVENTS)}
              >
                Events
              </button>
              <button
                className={`w-28 h-6 text-white transition-all duration-100 ${activeTab === TabType.FAVORITES ? "border-b-2" : ""}`}
                onClick={() => handleTabChange(TabType.FAVORITES)}
              >
                All Favorites
              </button>
            </div>
            {/*content for teams and events and favorites*/}
            <div className={`relative h-full w-full flex ${expanded ? "" : "opacity-0"}`}>
              <div className={`flex h-full flex-col items-center transition-all duration-200 [&>*]:transition-all [&>*]:duration-700 ${activeTab === TabType.TEAMS ? " w-full p-3" : "w-0 [&>*]:opacity-0"}`}>
                {/*infinite scroll of team results*/}
                <div className="flex flex-col h-[85%] gap-2 w-full p-2 items-center overflow-auto">
                  {teamResults.map((team, index) => {
                    return (
                      <TeamResult
                        key={index}
                        teamId={team.teamId}
                        teamNumber={team.teamNumber}
                        teamName={team.teamName}
                        programCode={team.programCode}
                        teamGrade={team.teamGrade}
                        teamOrg={team.teamOrg}
                        teamCity={team.teamCity}
                        teamRegion={team.teamRegion}
                        teamCountry={team.teamCountry}
                      />
                    )
                  })}
                  {teamResults.length === 0 && currentSearch.length == 0 && recentlyViewedTeams?.length > 0 ? <>
                    <h1 className="text-white text-left self-start font-semibold text-lg">Recently Viewed Teams</h1>
                    <hr className="w-full border-neutral-500"/>
                    {recentlyViewedTeams.map((team, index) => {
                      return (
                        <TeamResult
                          key={index}
                          teamId={team.teamId}
                          teamNumber={team.teamNumber}
                          teamName={team.teamName}
                          programCode={team.programCode}
                          teamGrade={team.teamGrade}
                          teamOrg={team.teamOrg}
                          teamCity={team.teamCity}
                          teamRegion={team.teamRegion}
                          teamCountry={team.teamCountry}
                        />
                      )
                    })}
                  </> : teamResults.length === 0 && currentSearch.length > 0 ? (
                      <h1 className="text-white text-center font-semibold text-lg">No teams found</h1>
                    ) : null
                  }
                  <LoadMore
                    loadMore={() => getTeams(currentTeamsPage + 1, true)}
                    active={teamResults.length !== 0 && teamResults.length % 15 === 0 && !loadingTeams && teamResults.length > 0}
                  />
                </div>
              </div>
              <div className={`flex h-full flex-col items-center transition-all duration-200 [&>*]:transition-all [&>*]:duration-700 ${activeTab === TabType.EVENTS ? " w-full p-3" : "w-0 [&>*]:opacity-0"}`}>
                <select
                    className="min-h-8 mb-1 w-full rounded-lg p-0.5 text-black bg-neutral-500"
                    value={seasonId}
                    onChange={(e) => setSeasonId(parseInt(e.target.value))}
                  >
                    <option value="173">Spin Up 2022-23</option>
                    <option value="181">Over Under 2023-24</option>
                </select>
                <div className="flex flex-col h-[85%] gap-2 w-full p-2 items-center overflow-auto">
                  {displayedEvents.map((event, index) => {
                    const locationString = `${event.location.city ? event.location.city + ", " : ""}${event.location.region ? event.location.region + ", " : ""}${event.location.country}`;
                    return (
                      <EventResult key={event.id} id={event.id} sku={event.sku} name={event.name} start={event.start} location={locationString} />
                    )
                  })}
                  <LoadMore
                    loadMore={increaseEventsShown}
                    active={displayedEvents.length !== 0 && displayedEvents.length % 15 === 0 && !loadingEvents && displayedEvents.length > 0}
                  />
                </div>
              </div>
              <div className={`flex h-full flex-col items-center transition-all duration-200 [&>*]:transition-all [&>*]:duration-700 ${activeTab === TabType.FAVORITES ? " w-full p-3" : "w-0 [&>*]:opacity-0"}`}>
                {isSignedIn ? (
                  <div className="flex flex-col h-[85%] gap-2 w-full p-2 items-center overflow-auto">
                    <h1 className="text-white text-left self-start font-semibold text-lg">Teams</h1>
                    <hr className="w-full border-neutral-500" />
                    {favoriteResults.teams.map((team, index) => {
                      return (
                        <TeamResult
                          key={index}
                          teamId={team.teamId}
                          teamNumber={team.teamNumber}
                          teamName={team.teamName}
                          programCode={team.programCode}
                          teamGrade={team.teamGrade}
                          teamOrg={team.teamOrg}
                          teamCity={team.teamCity}
                          teamRegion={team.teamRegion}
                          teamCountry={team.teamCountry}
                        />
                      )
                    })}
                    <h1 className="text-white text-left self-start font-semibold text-lg">Events</h1>
                    <hr className="w-full border-neutral-500" />
                    {favoriteResults.events.map((event, index) => {
                      const locationString = `${event.location.city ? event.location.city + ", " : ""}${event.location.region ? event.location.region + ", " : ""}${event.location.country}`;
                      return (
                        <EventResult key={event.id} id={event.id} sku={event.sku} name={event.name} start={event.start} location={locationString} />
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <h1 className="text-white text-center font-semibold text-lg">Sign in to view your favorites</h1>
                  </div>
                )}
              </div>
            </div>
          </div>
        </animated.div >
        {/*) : null}*/}
    </div>
  );
}