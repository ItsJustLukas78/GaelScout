import { WebhookEvent } from "@clerk/nextjs/server";
import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/db";
import { headers } from 'next/headers'
import { Webhook } from "svix";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || ``;

async function validateRequest(request: Request) {
  const payloadString = await request.text();
  const headerPayload = headers();

  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id")!,
    "svix-timestamp": headerPayload.get("svix-timestamp")!,
    "svix-signature": headerPayload.get("svix-signature")!,
  };
  const wh = new Webhook(webhookSecret);
  return wh.verify(payloadString, svixHeaders) as WebhookEvent;
}


export async function POST(request: Request) {
  try {
    const payload: WebhookEvent = await validateRequest(request);
    const { data, type } = payload;

    switch (type) {
      case "user.created":
      case "user.updated":
        // create a new user in your database
        const primaryEmail = data.email_addresses.find(
          (emailObject) => emailObject.id === data.primary_email_address_id
        )?.email_address;

        const user = await prisma.user.upsert({
          where: { id: data.id },
          update: {
            ...(data.username && { username: data.username }),
            ...(primaryEmail && { email: primaryEmail }),
            firstName: data.first_name,
            lastName: data.last_name,
          },
          create: {
            id: data.id,
            ...(data.username && { username: data.username }),
            ...(primaryEmail && { email: primaryEmail }),
            firstName: data.first_name,
            lastName: data.last_name,
          }
        });

        break;
      case "user.deleted":
        // delete the user from your database

        await prisma.user.delete({
          where: { id: data.id },
        });

        break;
      default:
        console.log(`Unhandled event type: ${type}`);
        break;
    }

    // everything went well
    return NextResponse.json({ message: "Received" });
  } catch (e) {
    // something went wrong
    // no changes were made to the database
    return NextResponse.error();
  }
}


export async function GET() {
  return NextResponse.json({message: "Hello World!"});
}