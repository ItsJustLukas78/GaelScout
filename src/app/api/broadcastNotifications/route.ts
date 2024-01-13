import { NextResponse, NextRequest } from "next/server";
import { getEventMatches } from "@/utils/RobotEventsAPI";
import prisma from "@/lib/db";
import { phone } from 'phone';
import { MatchNotification } from "@/app/types";
import twilio from 'twilio';

// Cron job calls this route every 5 minutes to check if any notifications need to be sent
export async function POST(
 request: NextRequest,
) {
  try {
    const allNotifications = await prisma.matchNotification.findMany();

    const formattedNotifications = allNotifications.map((notification) => {
      return {
        id: notification.id,
        userId: notification.userId,
        eventId: notification.eventId,
        divisionId: notification.divisionId,
        checkRound: notification.checkRound,
        checkInstance: notification.checkInstance,
        checkMatchnum: notification.checkMatchnum,
        checkMatchName: notification.checkMatchName,
        matchName: notification.matchName,
        phoneNumber: notification.phoneNumber,
        estimatedDate: notification.estimatedDate,
      }
    });

    // dictionary of eventId and divId to notifications
    const eventDivToNotifications: Record<number, Record<number, MatchNotification[]>> = {};

    formattedNotifications.forEach((notification) => {
      if (!eventDivToNotifications[notification.eventId]) {
        eventDivToNotifications[notification.eventId] = {};
      }
      if (!eventDivToNotifications[notification.eventId][notification.divisionId]) {
        eventDivToNotifications[notification.eventId][notification.divisionId] = [];
      }
      eventDivToNotifications[notification.eventId][notification.divisionId].push(notification);
    });

    // Checking each notification by eventId and divId to improve efficiency
    for (const eventId in eventDivToNotifications) {
      for (const divId in eventDivToNotifications[eventId]) {
        const notifications = eventDivToNotifications[eventId][divId];
        const matchList = await getEventMatches(parseInt(eventId), parseInt(divId));

        // check each notification
        for (const notification of notifications) {
          // check if match "started" is not null or empty
          const match = matchList.find((match) => {
            return match.matchnum === notification.checkMatchnum && match.round === notification.checkRound && match.instance === notification.checkInstance;
          });

          if (!match) {
            // delete notification
            await prisma.matchNotification.delete({
              where: {
                id: notification.id,
              }
            });

            console.log('match not found, deleting notification');
            continue;
          }

          // check if match is over
          if (match.started) {
            // delete notification
            await prisma.matchNotification.delete({
              where: {
                id: notification.id,
              }
            });

            await twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN).messages.create({
              body: `${notification.matchName} is less than 5 matches away! Get ready and queue up, good luck!`,
              from: process.env.TWILIO_PHONE_NUMBER,
              to: notification.phoneNumber,
            });
          }
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    console.log(e)
    return NextResponse.json({ error: 'Error sending notifications' }, { status: 500 });
  }
}