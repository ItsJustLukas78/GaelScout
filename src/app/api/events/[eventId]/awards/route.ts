import { NextResponse, NextRequest } from "next/server";
import {getEventAwards} from "@/utils/RobotEventsAPI";
import {EventAward} from "@/app/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const { eventId: rawEventId } = await params;
  const eventId = Number(rawEventId);

  if (!Number.isInteger(eventId)) {
    return NextResponse.json({ error: "Event ID is invalid" }, { status: 400 });
  }

  if (!eventId) {
    return NextResponse.json({ error: 'Event Id not provided' }, { status: 400 });
  }

  const REAwardObjects = await getEventAwards(eventId);

  const filteredAwardObjects = REAwardObjects.filter((award) => {
      return award.teamWinners.length !== 0
  })

  const awards: EventAward[] = filteredAwardObjects.reduce((acc: EventAward[], award) => {
    let duplicates = award.teamWinners.map((team: any) => {
      return {
        id: award.id,
        eventId: award.event.id,
        eventName: award.event.name,
        divisionId: team.division.id,
        name: award.title,
        qualification: award.qualifications[0],
        team: {
          teamId: team.team.id,
          teamNumber: team.team.name,
        },
        order: award.order,
      }
    })
    return acc.concat(duplicates)
  }, [])

  return NextResponse.json({awards: awards}, {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    }
  });
}