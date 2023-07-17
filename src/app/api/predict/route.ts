import prisma from "@/utils/DataBase";
import { NextResponse, NextRequest } from "next/server";
import { rating, predictWin } from 'openskill'

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
    const teams = await prisma.teamSeasonProfile.findMany({
      where: {
        teamNumber: {
          in: [r1Team, r2Team, b1Team, b2Team]
        },
        seasonId: seasonId
      }
    });

    if (teams.length !== 4) {
      const missingTeams = [r1Team, r2Team, b1Team, b2Team].filter(team => !teams.find(t => t.teamNumber === team));
      NextResponse.json({error: `Teams ${missingTeams.join(', ')} not found`}, {status: 404});
    }

    const rRatings = teams.filter(t => t.teamNumber === r1Team || t.teamNumber === r2Team).map(t => (rating({
      mu: t.opr,
      sigma: t.sigma
    })));
    const bRatings = teams.filter(t => t.teamNumber === b1Team || t.teamNumber === b2Team).map(t => (rating({
      mu: t.opr,
      sigma: t.sigma
    })));

    const prediction = predictWin([rRatings, bRatings]);

    const rChance = Math.round(prediction[0] * 100);
    const bChance = Math.round(prediction[1] * 100);

    return NextResponse.json({ rChance, bChance }, { status: 200 })
  } catch (e) {
    console.error(e);
    return NextResponse.json({error: 'An error occurred while processing your request'}, {status: 500});
  }
}