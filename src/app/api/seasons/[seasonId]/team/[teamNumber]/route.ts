import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

async function formatTeamSeasonProfile(teamSeasonProfile: any) {
  return {
    teamId: teamSeasonProfile.teamId,
    teamName: teamSeasonProfile.teamName,
    teamNumber: teamSeasonProfile.teamNumber,
    opr: teamSeasonProfile.opr,
    dpr: teamSeasonProfile.dpr,
    ccwm: teamSeasonProfile.ccwm,
    openSkill: teamSeasonProfile.openSkill,
    openSkillRank: teamSeasonProfile.openSkillRank,
    eventCount: teamSeasonProfile.eventCount,
    topProgSkills: teamSeasonProfile.topProgSkills,
    topDriverSkills: teamSeasonProfile.topDriverSkills,
    topTotalSkills: teamSeasonProfile.topTotalSkills,
    skillsRank: teamSeasonProfile.skillsRank,
    qualMatchCount: teamSeasonProfile.qualMatchCount,
    elimMatchCount: teamSeasonProfile.elimMatchCount,
    qualMatchWins: teamSeasonProfile.qualMatchWins,
    elimMatchWins: teamSeasonProfile.elimMatchWins,
    qualMatchLosses: teamSeasonProfile.qualMatchLosses,
    elimMatchLosses: teamSeasonProfile.elimMatchLosses,
    qualMatchWinPercentage: teamSeasonProfile.qualMatchWinPercentage,
    elimMatchWinPercentage: teamSeasonProfile.elimMatchWinPercentage,
    totalMatchWinPercentage: teamSeasonProfile.totalMatchWinPercentage,
    qualToRegionals: teamSeasonProfile.qualToRegionals,
    awardQualToWorlds: teamSeasonProfile.awardQualToWorlds,
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { seasonId: string, teamNumber: string } }
) {
  const teamNumber = params.teamNumber;
  const seasonId = parseInt(params.seasonId);

  if (!teamNumber || !seasonId) {
    return NextResponse.json({ error: 'Team number or Season ID not provided' }, { status: 400 });
  }

  const team = await prisma.teamSeasonProfile.findFirst({
    where: {
      teamNumber: teamNumber,
      seasonId: seasonId
    }
  });

  if (!team) {
    return NextResponse.json({ error: 'Team not found' }, { status: 404 });
  }

  const formattedTeam = await formatTeamSeasonProfile(team);

  const prettyJson = JSON.stringify(formattedTeam, null, 2);

  return NextResponse.json(prettyJson, { status: 200 })
}