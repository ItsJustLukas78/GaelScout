import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ seasonId: string}> }
) {
  const { seasonId: rawSeasonId } = await params;
  const seasonId = Number(rawSeasonId);

  if (!Number.isInteger(seasonId)) {
    return NextResponse.json({ error: "Season ID is invalid" }, { status: 400 });
  }

  if (!seasonId) {
    return NextResponse.json({ error: 'Season ID not provided' }, { status: 400 });
  }

  const SeasonAnalysis = await prisma.seasonAnalysis.findUnique({
    where: {
      seasonId: seasonId
    }
  })

  if (!SeasonAnalysis) {
    return NextResponse.json({ error: 'Season stats not found!' }, { status: 404 });
  }

  const formattedSeasonAnalysis = {
    seasonId: SeasonAnalysis.seasonId,
    seasonName: SeasonAnalysis.seasonName,
    numberOfTeams: SeasonAnalysis.numberOfTeams,
    numberOfRegionalQualifiers: SeasonAnalysis.numberOfRegionalQualifiers,
    numberOfWorldQualifiers: SeasonAnalysis.numberOfWorldsQualifiers,
  }

  const prettyJson = JSON.stringify(formattedSeasonAnalysis, null, 2);

  return new Response(prettyJson, {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    }
  });
}