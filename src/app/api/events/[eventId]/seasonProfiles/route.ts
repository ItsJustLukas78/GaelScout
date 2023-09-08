import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { getEventTeams } from "@/utils/RobotEventsAPI";
import { TeamProfile } from "@/app/types";

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