import { NextResponse, NextRequest } from "next/server";
import { getEventMatches } from "@/utils/RobotEventsAPI";
import { EventMatch } from "@/app/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: number, divId: number } }
) {
  const eventId = params.eventId;
  const divId = params.divId;

  if (!eventId || !divId) {
    return NextResponse.json({ error: 'Event or div id not provided' }, { status: 400 });
  }

  try {

    const REMatchObjects = await getEventMatches(eventId, divId);

    const matchResults: EventMatch[] = REMatchObjects.map((match) => {
      // @ts-ignore
      const blueAllianceObject = match.alliances.filter((alliance) => {
          return alliance.color === 'blue';
      })

      // @ts-ignore
      const redAllianceObject = match.alliances.filter((alliance) => {
        return alliance.color === 'red';
      })

      return {
        id: match.id,
        eventId: match.event.id,
        divisionId: match.division.id,
        round: match.round,
        instance: match.instance,
        matchnum: match.matchnum,
        field: match.field,
        name: match.name,
        // @ts-ignore
        blueTeams: blueAllianceObject.at(0).teams?.map((team) => {
          return {
            teamId: team.team.id,
            teamNumber: team.team.name,
          }
        }),
        // @ts-ignore
        redTeams: redAllianceObject.at(0).teams?.map((team) => {
          return {
            teamId: team.team.id,
            teamNumber: team.team.name,
          }
        }),
        blueScore: blueAllianceObject.at(0).score,
        redScore: redAllianceObject.at(0).score,
      }
    });

    return NextResponse.json({matches: matchResults}, {
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