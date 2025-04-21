import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// Get all bunches with optional rack filter
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const rack_id = searchParams.get("rack_id");

    const where = rack_id ? { rack_id: parseInt(rack_id) } : {};

    const bunches = await prisma.bunch.findMany({
      where,
      include: {
        items: true,
        rack: {
          include: {
            location: true,
          },
        },
      },
    });

    return NextResponse.json(bunches);
  } catch (error) {
    console.error("Failed to fetch bunches:", error);
    return NextResponse.json(
      { error: "Failed to fetch bunches" },
      { status: 500 }
    );
  }
}

// Create a new bunch
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, rack_id } = body;

    if (!name || !rack_id) {
      return NextResponse.json(
        { error: "Bunch name and rack ID are required" },
        { status: 400 }
      );
    }

    // Check if the rack exists
    const rack = await prisma.rack.findUnique({
      where: { id: rack_id },
      include: { bunches: true },
    });

    if (!rack) {
      return NextResponse.json({ error: "Rack not found" }, { status: 404 });
    }

    // Create the bunch
    const bunch = await prisma.bunch.create({
      data: {
        name,
        rack: {
          connect: { id: rack_id },
        },
      },
      include: {
        items: true,
        rack: {
          include: {
            location: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Bunch created successfully",
      bunch,
    });
  } catch (error) {
    console.error("Failed to create bunch:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Bunch with this name already exists in this rack" },
          { status: 400 }
        );
      }
    }
    return NextResponse.json(
      { error: "Failed to create bunch" },
      { status: 500 }
    );
  }
}
