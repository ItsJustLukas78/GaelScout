import { NextResponse, NextRequest } from "next/server";
import { getEvents } from "@/utils/RobotEventsAPI";
import { Event } from "@/app/types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const seasonId = searchParams.get('seasonId') || '181';

    const eventSKU: string[] = [];

    searchParams.forEach((value, key) => {
      if (key === 'eventSKU[]' || key === 'eventSKU') {
        eventSKU.push(value);
      }
    });

    if (!eventSKU) {
      return NextResponse.json({error: 'Event not found'}, {status: 400});
    }

    const eventSKURegex = new RegExp('^RE-VRC-\\d{2}-\\d{4}$');

    const validSKUs = eventSKU.filter((sku) => {
      return eventSKURegex.test(sku);
    });

    if (validSKUs.length === 0 && eventSKU.length !== 0) {
      return NextResponse.json({error: 'Event not found'}, {status: 400});
    }

    const foundEvents = await getEvents({eventSKUs: validSKUs, seasonId: parseInt(seasonId)});

    const formattedEvents: Event[] = foundEvents.map((event) => {
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
          address: event.location.address_1,
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
      }
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({error: 'An error occurred while processing your request'}, {status: 500});
  }
}