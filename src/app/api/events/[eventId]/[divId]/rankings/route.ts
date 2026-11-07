import { NextResponse, NextRequest } from "next/server";
import { getEventRankings } from "@/utils/RobotEventsAPI";
import {EventMatch, EventRank} from "@/app/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: string, divId: string } }
) {
  const { eventId: rawEventId, divId: rawDivId } = await params;
  const eventId = Number(rawEventId);
  const divId = Number(rawDivId);

  if (!Number.isInteger(eventId) || !Number.isInteger(divId)) {
    return NextResponse.json({ error: "Event or division ID is invalid" }, { status: 400 });
  }

  if (!eventId || !divId) {
    return NextResponse.json({ error: 'Event or div id not provided' }, { status: 400 });
  }

  try {

    const RERankObjects = await getEventRankings(eventId, divId);

    const eventRankings: EventRank[] = RERankObjects.map((rank) => {

      return {
        id: rank.id,
        eventId: rank.event.id,
        divisionId: rank.division.id,
        rank: rank.rank,
        team: {
          teamId: rank.team.id,
          teamNumber: rank.team.name,
        },
        wins: rank.wins,
        losses: rank.losses,
        ties: rank.ties,
        wp: rank.wp,
        ap: rank.ap,
        sp: rank.sp,
        high_score: rank.high_score,
        average_points: rank.average_points,
        total_points: rank.total_points,
      }
    });

    return NextResponse.json({rankings: eventRankings}, {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      }
    });
  } catch (e) {
    console.log(e)
    return NextResponse.json({ error: 'Error fetching event rankings' }, { status: 500 });
  }
}