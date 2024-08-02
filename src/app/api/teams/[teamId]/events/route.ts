import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { getTeamEvents } from "@/utils/RobotEventsAPI";
import {Event} from "@/app/types";



export async function GET(
  request: NextRequest,
  { params }: { params: { teamId: number } }
) {
  const teamId = params.teamId;

  const searchParams = new URL(request.url).searchParams;
  let seasonId = searchParams.get('seasonId') || undefined;

  if (!teamId || !seasonId) {
    return NextResponse.json({ error: 'Team or season id not provided' }, { status: 400 });
  }

  try {
    const teamEvents = await getTeamEvents(teamId, (parseInt(seasonId)) || 190);

    const formattedEvents: Event[] = teamEvents.map((event) => {
      return {
        id: event.id,
        sku: event.sku,
        name: event.name,
        start: event.start,
        end: event.end,
        season: {
          id: event.season.id,
          name: event.season.name,
        },
        program: {
          id: event.program.id,
          name: event.program.name,
          code: event.program.code,
        },
        location: {
          venue: event.location.venue,
          address: event.location.address,
          city: event.location.city,
          region: event.location.region,
          country: event.location.country,
          coordinates: event.location.coordinates,
        },
        // @ts-ignore
        divisions: event.divisions.map((division) => {
          return {
            id: division.id,
            name: division.name,
          }
        }),
      }
    });

    return NextResponse.json({ events: formattedEvents }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      }
    })
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Error fetching team events' }, { status: 500 });
  }
}