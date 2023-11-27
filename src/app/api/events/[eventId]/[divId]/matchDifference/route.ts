import { NextResponse, NextRequest } from "next/server";
import { getEventMatches } from "@/utils/RobotEventsAPI";
import { EventMatch } from "@/app/types";
import prisma from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: number, divId: number } }
) {
  const eventId = params.eventId;
  const divId = params.divId;

  const searchParams = new URL(request.url).searchParams;

  const matchnum = searchParams.get('matchnum') || null
  const round = searchParams.get('round') || null
  const instance = searchParams.get('instance') || null

  if (!eventId || !divId) {
    return NextResponse.json({ error: 'Event or div id not provided' }, { status: 400 });
  }

  if (!matchnum || !round || !instance) {
    return NextResponse.json({ error: 'Matchnum, round, or instance not provided' }, { status: 400 });
  }

  try {
    const REMatchObjects = await getEventMatches(eventId, divId);

    const matches: EventMatch[] = REMatchObjects.map((match) => {
      return {
        id: match.id,
        eventId: match.event.id,
        started: match.started,
        scheduled: match.scheduled,
        divisionId: match.division.id,
        round: match.round,
        instance: match.instance,
        matchnum: match.matchnum,
        field: match.field,
        name: match.name,
        blueTeams: match.alliances.at(0).teams?.map((team: any) => {
          return {
            teamId: team.team.id,
            teamNumber: team.team.name,
          }
        }),
        redTeams: match.alliances.at(1).teams?.map((team: any) => {
          return {
            teamId: team.team.id,
            teamNumber: team.team.name,
          }
        }),
        blueScore: match.alliances.at(0).score,
        redScore: match.alliances.at(1).score,
      }
    });

    const latestMatch = matches.filter((match) => {
      return match.started !== null;
    }).reduce((prev, current) => {
      return (prev.started > current.started) ? prev : current
    });

    const match = matches.filter((match) => {
      return match.matchnum === parseInt(matchnum) && match.round === parseInt(round) && match.instance === parseInt(instance);
    })[0];

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
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

      if (roundOrder[a.round] !== roundOrder[b.round]) {
        return roundOrder[a.round] - roundOrder[b.round];
      }

      if (a.matchnum !== b.matchnum) {
        return a.matchnum - b.matchnum;
      }

      if (a.instance !== b.instance) {
        return a.instance - b.instance;
      }

      return 0;
    }

    const sortedMatches = matches.sort(customSort);

    const matchDifference = sortedMatches.indexOf(match) - sortedMatches.indexOf(latestMatch);


    return NextResponse.json({ matchDifference }, {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      }
    });
  } catch (e) {
    console.log(e)
    return NextResponse.json({ error: 'Error fetching event matches' }, { status: 500 });
  }
}