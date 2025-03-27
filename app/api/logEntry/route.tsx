import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";

// Get all log entries
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const logEntries = await prisma.logEntry.findMany();
    return NextResponse.json(logEntries);
  } catch (error) {
    console.error("Failed to fetch log entries:", error);
    return NextResponse.json(
      { error: "Failed to fetch log entries" },
      { status: 500 }
    );
  }
}

// Create a new log entry
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json(
        {
          error: "Missing required field: log_type or log_message",
        },
        { status: 400 }
      );
    }

    const logEntry = await prisma.logEntry.create({
      data: {
        action,
        user: { connect: { id: Number(session.user.id) } },
      },
    });

    return NextResponse.json(
      {
        message: "Log entry created successfully",
        logEntry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create log entry:", error);
    return NextResponse.json(
      { error: "Failed to create log entry" },
      { status: 500 }
    );
  }
}
