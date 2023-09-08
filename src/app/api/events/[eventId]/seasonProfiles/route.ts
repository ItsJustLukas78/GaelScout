import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import {getEvents, getEventTeams} from "@/utils/RobotEventsAPI";

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
  const searchParams = new URL(request.url).searchParams;
  const eventId = params.eventId;
  const seasonId = searchParams.get('seasonId') || undefined;

  if (!eventId || !seasonId) {
    return NextResponse.json({ error: 'Both eventId and seasonId not provided' }, { status: 400 });
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

  const teamNumbers = teamResults.map((team) => {
    return team.teamNumber;
  });

  const teamSeasonProfiles = await prisma.teamSeasonProfile.findMany({
    where: {
      seasonId: parseInt(seasonId),
      teamNumber: {
        in: teamNumbers
      }
    }
  });

  return NextResponse.json({teamSeasonProfiles}, {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    }
  });
}