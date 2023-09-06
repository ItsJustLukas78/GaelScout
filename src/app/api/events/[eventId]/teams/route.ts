import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { getEventTeams } from "@/utils/RobotEventsAPI";

interface TeamResult {
  teamNumber: string;
  teamName: string;
  programCode: string;
  teamGrade: string;
  teamCity: string;
  teamRegion: string;
  teamCountry: string;
  teamOrg: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: number } }
) {
  const eventId = params.eventId;

  if (!eventId) {
    return NextResponse.json({ error: 'Event Id not provided' }, { status: 400 });
  }

  const RETeamObjects = await getEventTeams(eventId);

  const teamResults: TeamResult[] = RETeamObjects.map((team) => {
    return {
      teamNumber: team.number,
      teamName: team.team_name,
      programCode: team.program.code,
      teamGrade: team.grade,
      teamCity: team.location.city,
      teamRegion: team.location.region,
      teamCountry: team.location.country,
      teamOrg: team.organization,
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