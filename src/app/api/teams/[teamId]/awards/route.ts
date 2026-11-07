import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { getTeamAwards } from "@/utils/RobotEventsAPI";
import {Event, EventAward} from "@/app/types";



export async function GET(
  request: NextRequest,
  { params }: { params: { teamId: string } }
) {
  const { teamId: rawTeamId } = await params;
  const teamId = Number(rawTeamId);

  if (!Number.isInteger(teamId)) {
    return NextResponse.json({ error: "Team ID is invalid" }, { status: 400 });
  }

  const searchParams = new URL(request.url).searchParams;
  let seasonId = searchParams.get('seasonId') || undefined;

  if (!teamId || !seasonId) {
    return NextResponse.json({ error: 'Team or season id not provided' }, { status: 400 });
  }

  try {
    const teamAwards = await getTeamAwards(teamId, (parseInt(seasonId)) || 204);

    const formattedAwards: EventAward[] = teamAwards.map((award: any) => {
      const teamWinner = award.teamWinners.find((team: any) => {
        return team.team.id == teamId
      });

      return {
        id: award.id,
        eventId: award.event.id,
        eventName: award.event.name,
        divisionId: teamWinner.division.id,
        name: award.title,
        qualification: award.qualifications[0],
        team: {
          teamId: teamWinner.team.id,
          teamNumber: teamWinner.team.name,
        },
        order: award.order,
      }
    });

    return NextResponse.json({ awards: formattedAwards }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      }
    })
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Error fetching team awards' }, { status: 500 });
  }
}