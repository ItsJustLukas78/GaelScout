import prisma from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import {getEventTeams, getSeason, getTeamAwards, getTeamObject} from "@/utils/RobotEventsAPI";
import { TeamProfile } from "@/app/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
    //ignore request for now, add a script that automates the process of listing all the achievements of our teams
  //season id : 125

  // console.log("hi");
  //
  // const existingTeams = [
  //   { number: '5327A', id: 18349 },
  //   { number: '5327B', id: 18352 },
  //   { number: '5327C', id: 23563 },
  //   { number: '5327D', id: 23566 },
  //   { number: '5327E', id: 108679 },
  //   { number: '5327J', id: 153485 },
  //   { number: '5327K', id: 129041 },
  //   { number: '5327P', id: 150502 },
  //   { number: '5327R', id: 93449 },
  //   { number: '5327S', id: 93452 },
  //   { number: '5327U', id: 122707 },
  //   { number: '5327V', id: 108678 },
  //   { number: '5327W', id: 70979 },
  //   { number: '5327X', id: 81242 },
  //   { number: '5327Y', id: 169928 },
  //   { number: '5327Z', id: 108694 }
  // ]
  //
  // const seasonIds = [125, 130, 139, 154, 173];
  //
  // // For each season, formate a list of awards like this:
  // //  {
  // //   seasonName: "In The Zone",
  // //   seasonYears: "2017-2018",
  // //   tagLine: "Cones!",
  // //   achievements: [
  // //     {
  // //       teamNumber: "5327A",
  // //       awards: ["Excellence Award @ DV (qualified to states)", "Design Award @ Vanden", "Excellence Award @ Tracy", "Tournament Finalists @ Tracy"]
  // //     },
  // //     {
  // //       teamNumber: "5327C",
  // //       awards: ["Create Award @ DRC", "Amaze Award @ Bell", "Build Award @ Riverdale", "Tournament Champions @ Tracy (qualified to states)", "Tournament Champions @ San Jose States (qualified to worlds)"]
  // //     },
  // //     {
  // //       teamNumber: "5327R",
  // //       awards: ["Design Award @ DV (qualified to states)", "Judges @ Vanden", "Design @ Sacramento States (qualified to worlds)"]
  // //     },
  // //     {
  // //       teamNumber: "5327S",
  // //       awards: ["Tournament Finalists @ DV", "Tournament Champions @ 7th Annual (qualified to states)", "Create Award @ 7th Annual", "Tournament Finalists @ Armijo", "Tournament Finalists @ Tracy", "Robot Skills Champion @ Tracy", "Think Award @ Sacramento States", "Create Award @ Worlds"]
  // //     },
  // //     {
  // //       teamNumber: "5327X",
  // //       awards: ["Excellence Award @ DRC", "Tournament Finalists @ DV (qualified to states)", "Create Award @ 7th Annual", "Tournament Finalists @ Armijo", "Robot Skills Champion @ Armijo", "Create Award @ Armijo", "Design Award @ CV", "Skills Finalists @ CV"]
  // //     }
  // //   ]
  // // },
  //
  // // You can just ignore the qualification
  // // The award should be name + @ + event name
  // //
  // const allSeasons: any = [];
  //
  // for (const seasonId of seasonIds) {
  //   const seasonObject = {
  //     seasonName: "null",
  //     seasonYears: "null",
  //     tagLine: "LeaveThisAlone",
  //     achievements: []
  //   };
  //
  //   const finalAchievements: any = [];
  //
  //   for (const team of existingTeams) {
  //     const teamObject = {
  //       teamNumber: "null",
  //       awards: []
  //     };
  //
  //     const teamId = team.id;
  //
  //     teamObject.teamNumber = team.number;
  //
  //     const awards = await getTeamAwards(teamId, seasonId);
  //     const finalAwards: any = [];
  //
  //     awards.forEach((award: any) => {
  //       const awardString = award.title + " @ " + award.event.name;
  //       finalAwards.push(awardString);
  //     });
  //
  //     teamObject.awards = finalAwards;
  //
  //     finalAchievements.push(teamObject);
  //   }
  //
  //   seasonObject.achievements = finalAchievements;
  //
  //   const RESeason = await getSeason(seasonId);
  //
  //   seasonObject.seasonName = RESeason.name;
  //   seasonObject.seasonYears = RESeason.years_start + "-" + RESeason.years_end;
  //
  //   allSeasons.push(seasonObject);
  // }
  //
  // console.log(JSON.stringify(allSeasons, null, 2));
  //


  // for (const team of existingTeams) {
  //   const RETeam = await getTeamObject({teamNumber: team});
  //   if (RETeam) {
  //     existingTeamsWithID.push({number: RETeam.number, id: RETeam.id});
  //   }
  // }
  // console.log(existingTeamsWithID);


  //ignore everything:

  const searchParams = new URL(request.url).searchParams;

  const { eventId: rawEventId } = await params;
  const eventId = Number(rawEventId);

  if (!Number.isInteger(eventId)) {
    return NextResponse.json({ error: "Event ID is invalid" }, { status: 400 });
  }

  const seasonId = searchParams.get('seasonId') || undefined;

  if (!eventId || !seasonId) {
    return NextResponse.json({ error: 'Both eventId and seasonId not provided' }, { status: 400 });
  }

  const RETeamObjects = await getEventTeams(eventId);

  const teamResults: TeamProfile[] = RETeamObjects.map((team) => {
    return {
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

  const teamNumbers = teamResults.map((team) => {
    return team.teamNumber;
  });

  const teamSeasonProfiles = await prisma.teamSeasonProfile.findMany({
    where: {
      seasonId: parseInt(seasonId),
      teamNumber: {
        in: teamNumbers
      }
    }
  });

  return NextResponse.json({teamSeasonProfiles}, {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    }
  });
}