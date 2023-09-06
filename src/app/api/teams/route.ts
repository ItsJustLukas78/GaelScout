import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
// import rateLimit from "express-rate-limit";

// const allTeamsLimiter = rateLimit({
//   windowMs: 10 * 1000, // 10 seconds
//   max: 4
// });
//
// const teamLimiter = rateLimit({
//   windowMs: 5 * 1000, // 5 seconds
//   max: 10


/**
 * @swagger
 * /api/teams:
 *  get:
 *    tags:
 *      - Teams
 *    description: Returns teams
 *    parameters:
 *      - in: query
 *        name: region
 *        required: false
 *        description: The team region
 *        schema:
 *        type: string
 *      - in: query
 *        name: country
 *        required: false
 *        description: The team country
 *        schema:
 *        type: string
 *      - in: query
 *        name: grade
 *        required: false
 *        description: The team grade
 *        schema:
 *        type: string
 *      - in: query
 *        name: page
 *        required: false
 *        description: The page number for pagination
 *        schema:
 *        type: integer
 *        example: 1
 *        default: 1
 *        minimum: 1
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
  request: NextRequest
) {
  const searchParams = new URL(request.url).searchParams;
  const region = searchParams.get('region');
  const country = searchParams.get('country');
  const grade = searchParams.get('grade');
  const page = parseInt(searchParams.get('page') || '1');

  if (isNaN(page) || page < 1) {
    return NextResponse.json({ error: 'Page must be positive integer' }, { status: 400 });
  }

  const teams = await prisma.teamProfile.findMany({
    where: {
      teamRegion: region ? region : undefined,
      teamCountry: country ? country : undefined,
      teamGrade: grade ? grade : undefined,
    },
    skip: (page - 1) * 15,
    take: 15
  });

  const count = await prisma.teamProfile.count({
    where: {
      teamRegion: region ? region : undefined,
      teamCountry: country ? country : undefined,
      teamGrade: grade ? grade : undefined,
    }
  });

  // use meta in response to send pagination info

  const lastPage = Math.ceil(count / 15);

  const meta = {
    currentPage: page,
    lastPage: lastPage,
    firstPageUrl: 'https://gaelscout.com/api/teams?page=1',
    nextPageUrl: page < lastPage ? `https://gaelscout.com/api/teams?page=${page + 1}` :
      `https://gaelscout.com/api/teams?page=1`,
    total: count,
    perPage: 15,
  }

  const formattedResponse = {
    meta: meta,
    data: teams,
  }

  const prettyJson: string = JSON.stringify(formattedResponse, null, 2);

  return new Response(prettyJson, {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    }
  });
}
