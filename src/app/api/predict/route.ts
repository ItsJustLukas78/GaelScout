import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { rating, predictWin } from 'openskill'

/**
 * @swagger
 * /api/predict:
 *  get:
 *    tags:
 *      - Predict
 *    description: Returns the predicted outcome of a match
 *    responses:
 *      200:
 *        description: Predicted outcome of a match
 *      400:
 *        description: Team ID or Season ID not provided
 *      404:
 *        description: Team not found
 *      500:
 *        description: Internal server error
 *    parameters:
 *      - name: r1Team
 *        in: query
 *        description: Red 1 Team Number
 *        required: true
 *        schema:
 *        type: string
 *      - name: r2Team
 *        in: query
 *        description: Red 2 Team Number
 *        required: true
 *        schema:
 *        type: string
 *      - name: b1Team
 *        in: query
 *        description: Blue 1 Team Number
 *        required: true
 *        schema:
 *        type: string
 *      - name: b2Team
 *        in: query
 *        description: Blue 2 Team Number
 *        required: true
 *        schema:
 *        type: string
 *      - name: seasonId
 *        in: query
 *        description: Season ID
 *        required: true
 *        schema:
 *        type: integer
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.nextUrl);

  const r1Team = searchParams.get('r1Team');
  const r2Team = searchParams.get('r2Team');
  const b1Team = searchParams.get('b1Team');
  const b2Team = searchParams.get('b2Team');

  const seasonId = parseInt(searchParams.get('seasonId') || '');

  if (!r1Team || !r2Team || !b1Team || !b2Team || !seasonId) {
    NextResponse.json({ error: 'Team ID or Season ID not provided' }, { status: 400 });
    return;
  }

  try {
    let unFoundTeams = [];

    const r1TeamData = await prisma.teamSeasonProfile.findFirst({
      where: {
        teamNumber: r1Team,
        seasonId: seasonId,
      }
    });

    if (!r1TeamData) {
      unFoundTeams.push(r1Team);
    }

    const r2TeamData = await prisma.teamSeasonProfile.findFirst({
      where: {
        teamNumber: r2Team,
        seasonId: seasonId,
      }
    });

    if (!r2TeamData) {
      unFoundTeams.push(r2Team);
    }

    const b1TeamData = await prisma.teamSeasonProfile.findFirst({
      where: {
        teamNumber: b1Team,
        seasonId: seasonId,
      }
    });

    if (!b1TeamData) {
      unFoundTeams.push(b1Team);
    }

    const b2TeamData = await prisma.teamSeasonProfile.findFirst({
      where: {
        teamNumber: b2Team,
        seasonId: seasonId,
      }
    });

    if (!b2TeamData) {
      unFoundTeams.push(b2Team);
    }

    if (!r1TeamData || !r2TeamData || !b1TeamData || !b2TeamData) {
      return NextResponse.json({error: `Teams ${unFoundTeams.join(', ')} not found`}, {status: 404});
    }

    const rRatings = [r1TeamData, r2TeamData].map(t => (rating({
      mu: t.opr,
      sigma: t.sigma
    })));

    const bRatings = [b1TeamData, b2TeamData].map(t => (rating({
      mu: t.opr,
      sigma: t.sigma
    })));


    const prediction = predictWin([rRatings, bRatings]);

    const rChance = Math.round(prediction[0] * 100);
    const bChance = Math.round(prediction[1] * 100);

    return NextResponse.json({ rChance, bChance }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      }
    })
  } catch (e) {
    console.error(e);
    return NextResponse.json({error: 'An error occurred while processing your request'}, {status: 500});
  }
}