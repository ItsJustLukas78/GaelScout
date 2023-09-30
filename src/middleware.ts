import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { type NextFetchEvent, type NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@clerk/nextjs/server";

const generalRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.cachedFixedWindow(10, "10s"),
  ephemeralCache: new Map(),
  analytics: true,
});

const verifyRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.cachedFixedWindow(1, "30s"),
  ephemeralCache: new Map(),
  analytics: true,
});

const verifyGenRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.cachedFixedWindow(3, "30s"),
  ephemeralCache: new Map(),
  analytics: true,
});

async function middleware(request: NextRequest, event: NextFetchEvent): Promise<Response | undefined> {
  const ip = request.ip ?? "127.0.0.1";

  if (request.nextUrl.pathname === "/api/blocked") {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith('/api/predict') || request.nextUrl.pathname.startsWith('/api/seasons') || request.nextUrl.pathname.startsWith('/api/teams') || request.nextUrl.pathname.startsWith('/api/events')) {
    const { success, pending, limit, reset, remaining } = await generalRatelimit.limit(`ratelimit_middleware_${ip}`);
    event.waitUntil(pending);

    const res = success ? NextResponse.next() : NextResponse.redirect(new URL("/api/blocked", request.url));

    res.headers.set("X-RateLimit-Limit", limit.toString());
    res.headers.set("X-RateLimit-Remaining", remaining.toString());
    res.headers.set("X-RateLimit-Reset", reset.toString());
    console.log("Rate limit: " + remaining.toString() + "/" + limit.toString() + " resets at " + reset.toString())
    return res;
  }

  if (request.nextUrl.pathname.startsWith('/api/verify/generate')) {
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
  }

  return NextResponse.next();
}

export default authMiddleware({
  debug: true,
  publicRoutes: ["/"],

  afterAuth(auth, request: NextRequest, event: NextFetchEvent) {
    return middleware(request, event);
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};