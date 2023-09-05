import fetch, { Response } from 'node-fetch';
import Bottleneck from "bottleneck";

const API_KEY: string = process.env.ROBOT_EVENTS_TOKEN as string;

// requires testing
const throttler = new Bottleneck({
  reservoir: 94, // initial value
  reservoirRefreshAmount: 94,
  reservoirRefreshInterval: 60 * 1000,

  maxConcurrent: 5,
  minTime: 300,
});


async function apiCall(url: string, headers: object, params?: object): Promise<any> {
  try {
    let parametrized_url: string = url;

    if (params) {
      // @ts-ignore
      Object.keys(params).forEach(key => params[key] == null && delete params[key]);

      if (!params.hasOwnProperty('per_page')) {
        params = {...params, per_page: 250};
      }

      const searchParams = new URLSearchParams(params as any);

      Object.keys(params).forEach(key => {
        // @ts-ignore
        if (Array.isArray(params[key])) {
          // @ts-ignore
          searchParams.delete(key);
          // @ts-ignore
          params[key].forEach((value: any) => {
            searchParams.append(key + '[]', value);
          });
        }
      });

      parametrized_url += (url.includes('?') ? '&' : '?') + searchParams.toString();
    } else {
      params = {per_page: 250};

      const searchParams = new URLSearchParams(params as any);
      parametrized_url += (url.includes('?') ? '&' : '?') + searchParams.toString();
    }


    const response: Response = await throttler.schedule(() =>
      fetch(parametrized_url, {
        method: 'GET',
        headers: {...headers},
      }
    ));

    if (response.status === 429) {
      const wait_time: number = parseInt(response.headers.get("retry-after") || "5") + 1;
      console.log(`Sleeping for ${wait_time} seconds`);
      await new Promise((resolve) => setTimeout(resolve, wait_time * 1000));
      return apiCall(url, headers, params);
    } else if (response.status !== 200) {
      console.error(`Non-200 API call: ${url} - Params: ${JSON.stringify(params)} - Status: ${response.status}`);
      return null
    }

    return await response.json();
  } catch (error) {
    return null;
  }
}

// export async function getEventId(event_code: string): Promise<number | null> {
//   const url: string = "https://www.robotevents.com/api/v2/events";
//   const new_headers = {
//     "accept": "application/json",
//     "Authorization": "Bearer " + API_KEY,
//   };
//   const new_params = { sku: event_code };
//
//   try {
//     const response = await apiCall(url, new_headers, new_params);
//
//     const team_id: number = response.data[0]?.id;
//     if (!team_id) {
//       console.error("Warning: No id could be found");
//       return null;
//     }
//
//     return team_id;
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// }

// export async function getTeamId(team_number: string): Promise<number | null> {
//   const url = "https://www.robotevents.com/api/v2/teams";
//   const new_headers = {
//     "accept": "application/json",
//     "Authorization": "Bearer " + API_KEY,
//   };
//   const new_params = { number: team_number, registered: true };
//
//   try {
//     const response = await apiCall(url, new_headers, new_params);
//
//     const team_id: number = response.data[0]?.id;
//     if (!team_id) {
//       console.error("Warning: No id could be found");
//       return null;
//     }
//
//     return team_id;
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// }
//
// export async function getTeamObject(team_id: number): Promise<any | null> {
//   const url = `https://www.robotevents.com/api/v2/teams/${team_id}`;
//   const new_headers = {
//     "accept": "application/json",
//     "Authorization": "Bearer " + API_KEY,
//   };
//
//   try {
//     const team = await apiCall(url, new_headers);
//
//     if (!team) {
//       console.error("Warning: No team could be found");
//       return null;
//     }
//
//     return team;
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// }
//
// export async function getTeamSeasonId(team_id: number): Promise<number | null> {
//   const url = "https://www.robotevents.com/api/v2/seasons";
//   const new_headers = {
//     "accept": "application/json",
//     "Authorization": "Bearer " + API_KEY,
//   };
//   const new_params = { team: team_id, active: true };
//
//   try {
//     const response = await apiCall(url, new_headers, new_params);
//
//     const season_id: number = response.data[0]?.id;
//     if (!season_id) {
//       console.error("Warning: No season id could be found");
//       return null;
//     }
//
//     return season_id;
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// }
//
// export async function getTeamAwards(team_id: number, season_id?: number): Promise<any | null> {
//   const url = `https://www.robotevents.com/api/v2/teams/${team_id}/awards`;
//   const new_headers = {
//     "accept": "application/json",
//     "Authorization": "Bearer " + API_KEY,
//   };
//   const new_params = { season: season_id ? season_id : null };
//
//   const team_awards: any[] = [];
//
//   try {
//     const response = await apiCall(url, new_headers, new_params);
//
//     team_awards.push(...response.data);
//
//     let next_page_url = response.meta.next_page_url;
//
//     while (next_page_url) {
//       const nextPageResponse = await apiCall(next_page_url, new_headers, new_params);
//
//       next_page_url = nextPageResponse.meta.next_page_url;
//
//       team_awards.push(...nextPageResponse.data);
//     }
//
//     return team_awards.filter((event, index, self) => {
//       return index === self.findIndex((t) => t.id === event.id);
//     });
//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// }
//
// export async function getTeamEvents(team_id: number, season_id?: number): Promise<any[]> {
//   const url = `https://www.robotevents.com/api/v2/teams/${team_id}/events`;
//   const new_headers = {
//     "accept": "application/json",
//     "Authorization": "Bearer " + API_KEY,
//   };
//   const new_params = { season: season_id ? season_id : null};
//
//   const team_events: any[] = [];
//
//   try {
//     const response = await apiCall(url, new_headers, new_params);
//
//     team_events.push(...response.data);
//
//     let next_page_url = response.meta.next_page_url;
//
//     while (next_page_url) {
//       const nextPageResponse = await apiCall(next_page_url, new_headers, new_params);
//
//       next_page_url = nextPageResponse.meta.next_page_url;
//
//       team_events.push(...nextPageResponse.data);
//     }
//
//     return team_events.filter((event, index, self) => {
//       return index === self.findIndex((t) => t.id === event.id);
//     });
//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// }
//
// export async function getTeamMatches(team_id: number, event_id: string): Promise<any[]> {
//   const url = `https://www.robotevents.com/api/v2/teams/${team_id}/matches`;
//   const new_headers = {
//     "accept": "application/json",
//     "Authorization": "Bearer " + API_KEY,
//   };
//   const new_params = { event: event_id };
//
//   const team_matches: any[] = [];
//
//   try {
//     const response = await apiCall(url, new_headers, new_params);
//
//     team_matches.push(...response.data);
//
//     let next_page_url = response.meta.next_page_url;
//
//     while (next_page_url) {
//       const nextPageResponse = await apiCall(next_page_url, new_headers, new_params);
//
//       next_page_url = nextPageResponse.meta.next_page_url;
//
//       team_matches.push(...nextPageResponse.data);
//     }
//
//     return team_matches;
//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// }
//
// export async function getTeamSkills(team_id: number, seasonId?: number): Promise<any[] | null> {
//   const url = `https://www.robotevents.com/api/v2/teams/${team_id}/skills`;
//   const new_headers = {
//     "accept": "application/json",
//     "Authorization": "Bearer " + API_KEY,
//   };
//   const new_params = { season: seasonId };
//
//   const skills: any[] = [];
//
//   try {
//     const response = await apiCall(url, new_headers, new_params);
//
//     if (!response) {
//       return [];
//     } else if (!response.data || response.data.length === 0) {
//       return [];
//     }
//
//     skills.push(...response.data);
//
//     let next_page_url = response.meta.next_page_url;
//
//     while (next_page_url) {
//       const nextPageResponse = await apiCall(next_page_url, new_headers, new_params);
//
//       next_page_url = nextPageResponse.meta.next_page_url;
//
//       skills.push(...nextPageResponse.data);
//     }
//
//     return skills;
//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// }
//
// export async function getEventDivisions(event_id: number): Promise<number[] | null> {
//   const url = `https://www.robotevents.com/api/v2/events/${event_id}`;
//   const new_headers = {
//     "accept": "application/json",
//     "Authorization": "Bearer " + API_KEY,
//   };
//   const new_params = { event: event_id };
//
//   try {
//     const response = await apiCall(url, new_headers, new_params);
//
//     const divisions = response.divisions;
//
//     if (!divisions) {
//       console.error("Warning: No divisions could be found");
//       return null;
//     }
//
//     return divisions.map((division: any) => division.id);
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// }

export async function getEvents({seasonId, eventSKUs} : {seasonId?: number, eventSKUs?: string[]}): Promise<any[]> {
  const url = `https://www.robotevents.com/api/v2/events`;
  const new_headers = {
    "accept": "application/json",
    "Authorization": "Bearer " + API_KEY,
  };
  const new_params = { season: seasonId, sku: eventSKUs };

  const events: any[] = [];

  try {
    const response = await apiCall(url, new_headers, new_params);

    events.push(...response.data);

    let next_page_url = response.meta.next_page_url;

    while (next_page_url) {
      const nextPageResponse = await apiCall(next_page_url, new_headers, new_params);

      next_page_url = nextPageResponse.meta.next_page_url;

      events.push(...nextPageResponse.data);
    }

    return events;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// export async function getEventMatches(
//     event_id: number,
//     division_id: number,
//     round?: number,
//     matchnum?: number
// ): Promise<any[]> {
//   const url = `https://www.robotevents.com/api/v2/events/${event_id}/divisions/${division_id}/matches`;
//   const new_headers = {
//     "accept": "application/json",
//     "Authorization": "Bearer " + API_KEY,
//   };
//
//   const new_params = { round: round ? round : null, matchnum: matchnum ? matchnum : null };
//
//   const division_matches: any[] = [];
//
//   try {
//     const response = await apiCall(url, new_headers, new_params);
//
//     division_matches.push(...response.data);
//
//     let next_page_url = response.meta.next_page_url;
//
//     while (next_page_url) {
//       const nextPageResponse = await apiCall(next_page_url, new_headers, new_params);
//
//       next_page_url = nextPageResponse.meta.next_page_url;
//
//       division_matches.push(...nextPageResponse.data);
//     }
//
//     return division_matches;
//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// }

export async function getEventTeams(event_id: number) {
  const url = `https://www.robotevents.com/api/v2/events/${event_id}/teams`;
  const new_headers = {
    "accept": "application/json",
    "Authorization": "Bearer " + API_KEY,
  };

  const event_teams: any[] = [];

  try {
    const response = await apiCall(url, new_headers);

    event_teams.push(...response.data);

    let next_page_url = response.meta.next_page_url;

    while (next_page_url) {
      const nextPageResponse = await apiCall(next_page_url, new_headers);

      next_page_url = nextPageResponse.meta.next_page_url;

      event_teams.push(...nextPageResponse.data);
    }

    return event_teams;
  } catch (error) {
    return [];
  }
}

// export async function getSeason(seasonId: number) {
//   const url = `https://www.robotevents.com/api/v2/seasons/${seasonId}`;
//   const new_headers = {
//     "accept": "application/json",
//     "Authorization": "Bearer " + API_KEY,
//   };
//
//   try {
//     const response = await apiCall(url, new_headers);
//
//     if (!response) {
//       console.error("Warning: No Season could be found");
//       return null;
//     }
//
//     return response;
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// }