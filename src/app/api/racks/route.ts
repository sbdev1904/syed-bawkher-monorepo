import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// Get all racks with their bunches
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const location_id = searchParams.get("location_id");

    const where = location_id ? { location_id: parseInt(location_id) } : {};

    const racks = await prisma.rack.findMany({
      where,
      include: {
        bunches: {
          include: {
            items: {
              include: {
                unit: true,
                suppliers: {
                  include: {
                    supplier: true,
                  },
                },
              },
            },
          },
        },
        location: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(racks);
  } catch (error) {
    console.error("Failed to fetch racks:", error);
    return NextResponse.json(
      { error: "Failed to fetch racks" },
      { status: 500 }
    );
  }
}

// Create a new rack
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, location_id, capacity } = body;

    if (!name || !location_id) {
      return NextResponse.json(
        { error: "Rack name and location ID are required" },
        { status: 400 }
      );
    }

    const rack = await prisma.rack.create({
      data: {
        name,
        location: {
          connect: { id: parseInt(location_id) },
        },
        capacity: parseInt(capacity) || 100,
        current_utilization: 0,
      },
      include: {
        bunches: {
          include: {
            items: {
              include: {
                unit: true,
                suppliers: {
                  include: {
                    supplier: true,
                  },
                },
              },
            },
          },
        },
        location: true,
      },
    });

    await prisma.logEntry.create({
      data: {
        action: `Created rack with ID ${rack.id}`,
        user: { connect: { id: Number(session.user.id) } },
      },
    });

    return NextResponse.json({
      message: "Rack created successfully",
      rack,
    });
  } catch (error) {
    console.error("Failed to create rack:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Rack with this name already exists in this location" },
          { status: 400 }
        );
      }
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Location not found" },
          { status: 404 }
        );
      }
    }
    return NextResponse.json(
      { error: "Failed to create rack" },
      { status: 500 }
    );
  }
}
