import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { type NextFetchEvent, type NextRequest, NextResponse } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";

type Unit = "ms" | "s" | "m" | "h" | "d";
type Duration = `${number} ${Unit}` | `${number}${Unit}`;

const createLimit = (limit: number, duration: Duration) => {
  return new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.cachedFixedWindow(limit, duration),
    ephemeralCache: new Map(),
    analytics: true,
  });
}

const generalRatelimit = createLimit(40, "40s");
const verifyRatelimit = createLimit(1, "30s");
const verifyGenRatelimit = createLimit(3, "30s");
const notesGroupCreateRatelimit = createLimit(3, "60s");

const generalPaths = [
  '/api/predict',
  '/api/seasons',
  '/api/teams',
  '/api/events',
  '/api/favorites',
  '/api/notesGroups/join',
  '/api/notesGroups/leave'
];

async function proxy(auth: any, request: NextRequest, event: NextFetchEvent): Promise<Response | undefined> {
  if (!(auth.userId || auth.isPublicRoute)) {
    // redirect to /login

    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const ip = request.ip ?? "127.0.0.1";

  if (request.nextUrl.pathname === "/api/blocked") {
    return NextResponse.next();
  } else if (generalPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
    const { success, pending, limit, reset, remaining } = await generalRatelimit.limit(`ratelimit_middleware_${ip}`);
    event.waitUntil(pending);

    const res = success ? NextResponse.next() : NextResponse.redirect(new URL("/api/blocked", request.url));

    res.headers.set("X-RateLimit-Limit", limit.toString());
    res.headers.set("X-RateLimit-Remaining", remaining.toString());
    res.headers.set("X-RateLimit-Reset", reset.toString());
    console.log("Rate limit: " + remaining.toString() + "/" + limit.toString() + " resets at " + reset.toString())
    return res;
  } else if (request.nextUrl.pathname.startsWith('/api/verify/generate')) {
    const { success, pending, limit, reset, remaining } = await verifyGenRatelimit.limit(`ratelimit_middleware_verify_gen_${ip}`);
    event.waitUntil(pending);

    // instead of redirecting to /api/blocked, we return a 429 error
    const res = success ? NextResponse.next() : NextResponse.json({error: 'Too many requests'}, {status: 429});

    res.headers.set("X-RateLimit-Limit", limit.toString());
    res.headers.set("X-RateLimit-Remaining", remaining.toString());
    res.headers.set("X-RateLimit-Reset", reset.toString());
    console.log("Rate limit: " + remaining.toString() + "/" + limit.toString() + " resets at " + reset.toString())
    return res;
  } else if (request.nextUrl.pathname.startsWith('/api/verify/')) {
    const { success, pending, limit, reset, remaining } = await verifyRatelimit.limit(`ratelimit_middleware_verify_${ip}`);
    event.waitUntil(pending);

    // instead of redirecting to /api/blocked, we return a 429 error
    const res = success ? NextResponse.next() : NextResponse.json({error: 'Too many requests'}, {status: 429});

    res.headers.set("X-RateLimit-Limit", limit.toString());
    res.headers.set("X-RateLimit-Remaining", remaining.toString());
    res.headers.set("X-RateLimit-Reset", reset.toString());
    console.log("Rate limit: " + remaining.toString() + "/" + limit.toString() + " resets at " + reset.toString())
    return res;
    // only check post requests
  } else if (request.nextUrl.pathname.startsWith('/api/notesGroups') && request.method === 'POST') {
    const { success, pending, limit, reset, remaining } = await notesGroupCreateRatelimit.limit(`ratelimit_middleware_notesgroup_${ip}`);
    event.waitUntil(pending);

    // instead of redirecting to /api/blocked, we return a 429 error
    const res = success ? NextResponse.next() : NextResponse.json({error: 'Too many requests'}, {status: 429});

    res.headers.set("X-RateLimit-Limit", limit.toString());
    res.headers.set("X-RateLimit-Remaining", remaining.toString());
    res.headers.set("X-RateLimit-Reset", reset.toString());
    console.log("Rate limit: " + remaining.toString() + "/" + limit.toString() + " resets at " + reset.toString())
    return res;
  }

  return NextResponse.next();
}

export default clerkMiddleware({
  publicRoutes: [
    '/',
    '/privacy',
    '/teams/:teamId*',
    '/events/:eventId*',
    '/profiles/:profileId*',
    '/rankings',
    '/predict',
    '/sign-in',
    '/sign-up',
    '/predictionModel/:route*',
    '/api/:route*',
    '/favorites/:route*',
    '/~offline',
    '/not-found',
  ],
  apiRoutes: ['/api/:route*'],

  //@ts-ignore
  afterAuth(auth, request: NextRequest, event: NextFetchEvent) {
    return middleware(auth, request, event);
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};