import prisma from "@/utils/DataBase";
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
    NextResponse.json({ error: 'Team ID or Season ID not provided' }, { status: 400 });
    return;
  }

  const team = await prisma.teamSeasonProfile.findFirst({
    where: {
      teamNumber: teamNumber,
      seasonId: seasonId
    }
  });

  if (!team) {
    NextResponse.json({ error: 'Team not found' }, { status: 404 });
    return;
  }

  const formattedTeam = await formatTeamSeasonProfile(team);

  return NextResponse.json(formattedTeam, { status: 200 })
}