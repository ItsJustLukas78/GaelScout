// @ts-nocheck
import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import {getTeamObject} from "@/utils/RobotEventsAPI";


/**
 * @swagger
 * /api/teams/{teamNumber}:
 *  get:
 *    tags:
 *      - Teams
 *    description: Returns the team with the given team number
 *    parameters:
 *      - in: path
 *        name: teamNumber
 *        required: true
 *        description: The team number
 *        schema:
 *        type: string
 *    responses:
 *      200:
 *        description: The team with the given team number in the given season
 *      400:
 *        description: Team number not provided
 *      404:
 *        description: Team not found
 *      500:
 *        description: Internal server error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { teamNumber: string } }
) {
  const teamNumber = params.teamNumber;

  if (!teamNumber) {
    return NextResponse.json({ error: 'Team number not provided' }, { status: 400 });
  }

  let team = await prisma.teamProfile.findFirst({
    where: {
      teamNumber: teamNumber,
    }
  });

  // update if last updated date is old ?? cache!!

  if (!team) {
    team = await getTeamObject({teamNumber: teamNumber});

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    team = await prisma.teamProfile.create({
      data: {
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
  }

  return NextResponse.json({ team }, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    }
  })
}