import { NextResponse, NextRequest } from "next/server";
import {SkillsStandingsData} from "@/app/types";
import {getSkillsStandings} from "@/utils/RobotEventsAPI";

export async function GET(
  request: NextRequest, { params }: { params: { seasonId: string } }
) {
  // try {
  //   const searchParams = new URL(request.url).searchParams;
  //   const seasonId = parseInt(params.seasonId);
  //
  //   if (!seasonId) {
  //     return NextResponse.json({error: 'Season ID not provided'}, {status: 400});
  //   }
  //
  //   const skillsStandings: SkillsStandingsData[] = await getSkillsStandings({seasonId});
  //
  //   return NextResponse.json({skillsStandings}, {
  //     status: 200,
  //     headers: {
  //       'Access-Control-Allow-Origin': '*',
  //       'Access-Control-Allow-Methods': 'GET, OPTIONS',
  //     }
  //   });
  // } catch (error) {
  //   console.error(error);
  //   return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
  // }

  return NextResponse.json({error: 'Not Found'}, {status: 404});
}
