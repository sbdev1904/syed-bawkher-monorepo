import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// Get all locations with their racks and bunches
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const locations = await prisma.location.findMany({
      include: {
        racks: {
          include: {
            bunches: {
              include: {
                items: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(locations);
  } catch (error) {
    console.error("Failed to fetch locations:", error);
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    );
  }
}

// Create a new location
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Location name is required" },
        { status: 400 }
      );
    }

    const location = await prisma.location.create({
      data: {
        name,
        description,
      },
    });

    await prisma.logEntry.create({
      data: {
        action: `Location ${name} created`,
        user: { connect: { id: Number(session.user.id) } },
      },
    });

    return NextResponse.json({
      message: "Location created successfully",
      location,
    });
  } catch (error) {
    console.error("Failed to create location:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Location with this name already exists" },
          { status: 400 }
        );
      }
    }
    return NextResponse.json(
      { error: "Failed to create location" },
      { status: 500 }
    );
  }
}
