import { NextResponse, NextRequest } from "next/server";
import * as cheerio from 'cheerio';

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams;

    const name = searchParams.get('name');
    const country_region_id = searchParams.get('country_region_id');
    const country_id = searchParams.get('country_id');
    const grade_level_id = searchParams.get('grade_level_id');
    const seasonId = searchParams.get('seasonId');
    const page = searchParams.get('page') || '1'

    const newSearchParams = new URLSearchParams();

    if (name) {
      newSearchParams.append('name', name);
    }

    if (country_region_id) {
      newSearchParams.append('country_region_id', country_region_id);
    }

    if (country_id) {
      newSearchParams.append('country_id', country_id);
    }

    if (grade_level_id) {
      newSearchParams.append('grade_level_id', grade_level_id);
    }

    if (seasonId) {
      newSearchParams.append('seasonId', seasonId);
    }

    if (page) {
      newSearchParams.append('page', page);
    }


    const REURL: string = `https://www.robotevents.com/robot-competitions/vex-robotics-competition/?${newSearchParams}`;

    const response = await fetch(REURL);

    const html = await response.text();

    const $ = cheerio.load(html);

    const foundEventSKUs: string[] = [];

    const eventSKURegex = new RegExp('^RE-VRC-\\d{2}-\\d{4}$');

    $('a[href*="https://www.robotevents.com/robot-competitions/vex-robotics-competition/"]').each((i, elem) => {
      const href = $(elem).attr('href');
      const eventSKU = href?.replace('https://www.robotevents.com/robot-competitions/vex-robotics-competition/', '').replace('.html', '');
      if (eventSKU) {
        if (eventSKURegex.test(eventSKU)) {
          foundEventSKUs.push(eventSKU);
        }
      }
    });

    return NextResponse.json({eventSKUs: foundEventSKUs}, {
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