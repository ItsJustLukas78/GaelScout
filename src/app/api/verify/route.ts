import { NextResponse, NextRequest } from "next/server";
import { clerkClient } from "@clerk/nextjs";
import {getTeamRobotName} from "@/utils/puppeteer";


export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const userId = data.userId;
    const teamNumber = data.teamNumber;

    if (!userId) {
      return NextResponse.json({error: 'User ID not provided'}, {status: 400});
    }

    if (!teamNumber) {
      return NextResponse.json({error: 'Team number not provided'}, {status: 400});
    }

    const clerkUser = await clerkClient.users.getUser(userId);

    if (!clerkUser) {
      return NextResponse.json({error: 'User not found'}, {status: 404});
    }

    const verificationCode = clerkUser.privateMetadata.verificationCode;

    if (!verificationCode) {
      return NextResponse.json({error: 'Verification code not found'}, {status: 404});
    }

    const currentTeamRobotName = await getTeamRobotName(teamNumber);

    if (!currentTeamRobotName) {
      return NextResponse.json({error: 'Team or robot name not found'}, {status: 404});
    }

    if (verificationCode !== currentTeamRobotName) {
      return NextResponse.json({error: 'Verification code does not match'}, {status: 400});
    }

    await clerkClient.users.updateUserMetadata(clerkUser.id, {
      publicMetadata: {
        ...clerkUser.publicMetadata,
        verifiedTeamNumber: teamNumber,
      }
    });

    return NextResponse.json({verifiedTeamNumber: teamNumber}, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      }
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({error: 'An error occurred while processing your request'}, {status: 500});
  }
}