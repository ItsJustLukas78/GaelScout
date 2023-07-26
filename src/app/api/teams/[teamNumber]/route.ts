import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";


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

  return NextResponse.json(prettyJson, { status: 200 })
}