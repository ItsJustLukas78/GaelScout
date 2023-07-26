import {NextRequest, NextResponse} from "next/server";


export async function GET(request: NextRequest) {
  return NextResponse.json({ error: 'You are rate limited' }, { status: 429 });
}