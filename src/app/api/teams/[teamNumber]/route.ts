import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";


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

  const team = await prisma.teamProfile.findFirst({
    where: {
      teamNumber: teamNumber,
    }
  });

  if (!team) {
    return NextResponse.json({ error: 'Team not found' }, { status: 404 });
  }

  const prettyJson: string = JSON.stringify(team, null, 2);

  return new Response(prettyJson, {
    status: 200,
    headers: {
      'content-type': 'application/json',
    }
  });
}