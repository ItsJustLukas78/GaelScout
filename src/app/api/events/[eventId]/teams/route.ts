import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { getEventTeams } from "@/utils/RobotEventsAPI";
import { TeamProfile } from "@/app/types";

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

  const RETeamObjects = await getEventTeams(eventId);

  const teamResults: TeamProfile[] = RETeamObjects.map((team) => {
    return {
      teamId: team.id,
      teamName: team.team_name,
      teamNumber: team.number,
      robotName: team.robot_name,
      teamGrade: team.grade,
      teamOrg: team.organization,
      teamCity: team.location.city,
      teamRegion: team.location.region,
      teamCountry: team.location.country,
      programCode: team.program.code,
      programId: team.program.id,
    }
  });

  return NextResponse.json({teams: teamResults}, {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    }
  });
}