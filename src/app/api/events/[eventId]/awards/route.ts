import { NextResponse, NextRequest } from "next/server";
import {getEventAwards} from "@/utils/RobotEventsAPI";
import {EventAward} from "@/app/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: number } }
) {
  const eventId = params.eventId;

  if (!eventId) {
    return NextResponse.json({ error: 'Event Id not provided' }, { status: 400 });
  }

  const REAwardObjects = await getEventAwards(eventId);

  const awards: EventAward[] = REAwardObjects.map((award) => {
    return {
      id: award.id,
      eventId: award.event.id,
      divisionId: award.teamWinners[0].division.id,
      name: award.title,
      qualification: award.qualifications[0],
      team: {
        teamId: award.teamWinners[0].team.id,
        teamNumber: award.teamWinners[0].team.name,
      },
      order: award.order,
    }
  });

  return NextResponse.json({awards: awards}, {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    }
  });
}