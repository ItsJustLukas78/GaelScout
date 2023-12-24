import { NextResponse, NextRequest } from "next/server";
import { getEvents } from "@/utils/RobotEventsAPI";
import { Event } from "@/app/types";

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  try {
    const foundEvents = await getEvents({onlyActive: true});

    // filter events that have a start or end date that fall between yesterday and tomorrow
    // Get current date in the specified timezone
    const now = new Date();
    const timeZoneOffset = -5 * 60 * 60 * 1000; // GMT-5 offset in milliseconds
    const currentDateTimezone = new Date(now.getTime() + timeZoneOffset);

    const yesterday = new Date(currentDateTimezone);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setUTCHours(0, 0, 0, 0);

    const tomorrow = new Date(currentDateTimezone);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);

    const filteredEvents = foundEvents.filter((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);

      eventStart.setTime(eventStart.getTime());
      eventEnd.setTime(eventEnd.getTime());

      eventStart.setUTCHours(0, 0, 0, 0);
      eventEnd.setUTCHours(0, 0, 0, 0);

      return (eventStart > yesterday && eventStart < tomorrow) || (eventEnd > yesterday && eventEnd < tomorrow);
    });

    const formattedEvents: Event[] = filteredEvents.map((event) => {
      return {
        id: event.id,
        sku: event.sku,
        name: event.name,
        start: event.start,
        end: event.end,
        season: {
          id: event.season.id,
          name: event.season.name,
        },
        program: {
          id: event.program.id,
          name: event.program.name,
          code: event.program.code,
        },
        location: {
          venue: event.location.venue,
          address: event.location.address,
          city: event.location.city,
          region: event.location.region,
          country: event.location.country,
          coordinates: event.location.coordinates,
        },
        // @ts-ignore
        divisions: event.divisions.map((division) => {
          return {
            id: division.id,
            name: division.name,
          }
        }),
      }
    });

    return NextResponse.json({events: formattedEvents}, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Cache-Control': `s-maxage=${revalidate}, stale-while-revalidate`,
      }
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({error: 'An error occurred while processing your request'}, {status: 500});
  }
}