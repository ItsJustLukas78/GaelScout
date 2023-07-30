import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { ApolloServer } from '@apollo/server';
import { NextRequest } from 'next/server';
import { gql } from 'graphql-tag';
import prisma from "@/lib/db";
import { makeExecutableSchema } from "@graphql-tools/schema";
// import { shield } from 'graphql-shield';
// import { applyMiddleware } from 'graphql-middleware';
// import {
//   createRateLimitDirective,
//   RedisStore,
//   getGraphQLRateLimiter,
//   createRateLimitRule,
// } from 'graphql-rate-limit';
// import redis from 'redis';
import { GraphQLSchemaContext } from "@apollo/server";
import { defaultKeyGenerator, rateLimitDirective } from "graphql-rate-limit-directive";
import Redis from 'ioredis';
import { IRateLimiterRedisOptions, RateLimiterRedis } from "rate-limiter-flexible";

class DebugRateLimiterRedis extends RateLimiterRedis {
  consume(key: any, pointsToConsume: any, options: any) {
    console.log(`[CONSUME] ${key} for ${pointsToConsume}`);
    return super.consume(key, pointsToConsume, options);
  }
}

const keyGenerator = (directiveArgs: any, source: any, args: any, context: any, info: any) => {
   const ip = context.ip ?? "127.0.0.1";

  return `${ip}:${defaultKeyGenerator(directiveArgs, source, args, context, info)}`;
};

const redisClient = new Redis("rediss://default:41f0535bf1784ea1826b8cfc73cae415@usw1-sure-guppy-33341.upstash.io:33341");


redisClient.on('ready', () => {
  console.log('[REDIS] Connection established')
});
redisClient.on('end', () => {
  console.log('[REDIS] Connection closed')
});
redisClient.on('error', error => {
  console.log(error);
});


const { rateLimitDirectiveTypeDefs, rateLimitDirectiveTransformer } = rateLimitDirective<GraphQLSchemaContext,
        IRateLimiterRedisOptions>({
  keyGenerator: keyGenerator,
  limiterClass: DebugRateLimiterRedis,
  limiterOptions: {
    storeClient: redisClient,
  },

});


const typeDefs = [
  rateLimitDirectiveTypeDefs,
  gql`
  type Query {
    teamProfiles(
      teamNumber: String,
      region: String,
      country: String,
      grade: String,
      Page: Int
    ): TeamProfilePage
      @rateLimit(
        limit: 40
      )
      
    teamProfile(
      teamNumber: String!
    ): TeamProfile
      @rateLimit(
        limit: 60
      )
    teamSeasonProfiles(
      seasonId: Int!,
      page: Int
    ): TeamSeasonProfilePage
      @rateLimit(
        limit: 40
      )
    teamSeasonProfile(
      teamNumber: String!,
      seasonId: Int!
    ): TeamSeasonProfile
      @rateLimit(
        limit: 60
      )
  }
  
  type PageInfo {
    currentPage: Int
    lastPage: Int
    hasNextPage: Boolean
    hasPreviousPage: Boolean
    total: Int
    perPage: Int
  }

  type TeamProfile {
    teamId: Int!
    teamName: String!
    teamNumber: String!
    robotName: String
    teamGrade: String
    teamOrg: String
    teamCity: String
    teamRegion: String
    teamCountry: String
    programId: Int
    programCode: String
    TeamSeasonProfiles: [TeamSeasonProfile]
  }
  
  type TeamProfilePage {
    data: [TeamProfile]
    meta: PageInfo
  }

  type TeamSeasonProfile {
    id: Int!
    teamId: Int!
    teamName: String!
    teamNumber: String!
    seasonId: Int!
    seasonName: String!
    mu: Float!
    sigma: Float!
    openSkill: Float!
    openSkillRank: Int!
    opr: Float!
    dpr: Float!
    ccwm: Float!
    oprCum: Float!
    dprCum: Float!
    eventCount: Int!
    topProgSkills: Int!
    topDriverSkills: Int!
    topTotalSkills: Int!
    skillsRank: Int!
    qualMatchCount: Int!
    elimMatchCount: Int!
    qualMatchWins: Int!
    elimMatchWins: Int!
    qualMatchLosses: Int!
    elimMatchLosses: Int!
    qualMatchWinPercentage: Float!
    elimMatchWinPercentage: Float!
    totalMatchWinPercentage: Float!
    qualToRegionals: Boolean!
    awardQualToWorlds: Boolean!
  }
  
  type TeamSeasonProfilePage {
    data: [TeamSeasonProfile]
    meta: PageInfo
  }`
];

const resolvers = {
  Query: {
    teamProfiles: async (_: any, args: any, context: any) => {
      const { teamNumber, region, country, grade, page } = args;

      let newPage = page;

      if (!page || page < 1) {
        newPage = 1;
      }

      const where = {
        teamNumber: teamNumber ? { contains: teamNumber } : undefined,
        teamRegion: region ? { contains: region } : undefined,
        teamCountry: country ? { contains: country } : undefined,
        teamGrade: grade ? { contains: grade } : undefined,
      };

      const count = await prisma.teamProfile.count({
        where: where,
      });

      const results = await prisma.teamProfile.findMany({
        where: where,
        include: {
          TeamSeasonProfiles: true
        },
        skip: (newPage - 1) * 15,
        take: 15,
      });


      return {
        data: results,
        pageInfo: {
          currentPage: newPage,
          lastPage: Math.ceil(count / 15),
          hasNextPage: newPage < Math.ceil(count / 15),
          hasPreviousPage: newPage > 1,
          total: count,
          perPage: 15,
        }
      }
    },

    teamProfile: async (_: any, args: any, context: any) => {
      const { teamNumber } = args;

      return prisma.teamProfile.findFirst({
        where: {
          teamNumber: teamNumber
        }
      });
    },

    teamSeasonProfiles: async (_: any, args: any, context: any) => {
      const { seasonId, page } = args;

      let newPage = page;

      if (!page || page < 1) {
        newPage = 1;
      }

      const count = await prisma.teamSeasonProfile.count({
        where: {
          seasonId: seasonId
        },
      });

      const results = await prisma.teamSeasonProfile.findMany({
        where: {
          seasonId: seasonId
        },
        skip: (newPage - 1) * 15,
        take: 15,
      });

      return {
        data: results,
        pageInfo: {
          currentPage: newPage,
          lastPage: Math.ceil(count / 15),
          hasNextPage: newPage < Math.ceil(count / 15),
          hasPreviousPage: newPage > 1,
          total: count,
          perPage: 15,
        }
      }
    },

    teamSeasonProfile: async (_: any, args: any, context: any) => {
      const { teamNumber, seasonId } = args;

      return prisma.teamSeasonProfile.findFirst({
        where: {
          teamNumber: teamNumber,
          seasonId: seasonId
        }
      });
    }
  }
}

let schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

schema = rateLimitDirectiveTransformer(schema);


const server = new ApolloServer({schema});

// req has the type NextRequest
const handler = startServerAndCreateNextHandler<NextRequest>(server, { context: async req => ({ req }) });

export async function GET(request: NextRequest) {
  const response = await handler(request);

  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  return response;
}

export async function POST(request: NextRequest) {
  const response = await handler(request);

  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  return response;
}