import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bunch_id = parseInt((await params).id);
    if (isNaN(bunch_id)) {
      return NextResponse.json({ error: "Invalid bunch ID" }, { status: 400 });
    }

    const { newrack_id } = await req.json();
    if (!newrack_id) {
      return NextResponse.json(
        { error: "New rack ID is required" },
        { status: 400 }
      );
    }

    // Get the bunch with its items and current rack
    const bunch = await prisma.bunch.findUnique({
      where: { id: bunch_id },
      include: {
        items: true,
        rack: true,
      },
    });

    if (!bunch) {
      return NextResponse.json({ error: "Bunch not found" }, { status: 404 });
    }

    // Get the new rack
    const newRack = await prisma.rack.findUnique({
      where: { id: newrack_id },
    });

    if (!newRack) {
      return NextResponse.json(
        { error: "New rack not found" },
        { status: 404 }
      );
    }

    // Calculate total quantity of items in the bunch
    const totalQuantity = bunch.items.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );

    // Check if the new rack has enough capacity
    if (totalQuantity > newRack.capacity) {
      return NextResponse.json(
        {
          error: "Moving this bunch would exceed the new rack's capacity",
          current_utilization: newRack.current_utilization,
          capacity: newRack.capacity,
          required_space: totalQuantity,
        },
        { status: 400 }
      );
    }

    // Move the bunch and update rack utilization in a transaction
    const updatedBunch = await prisma.$transaction(async (tx) => {
      // Update the old rack's utilization
      await tx.rack.update({
        where: { id: bunch.rack_id },
        data: {
          current_utilization: {
            decrement: totalQuantity,
          },
        },
      });

      // Update the new rack's utilization
      await tx.rack.update({
        where: { id: newrack_id },
        data: {
          current_utilization: {
            increment: totalQuantity,
          },
        },
      });

      // Move the bunch to the new rack
      return await tx.bunch.update({
        where: { id: bunch_id },
        data: {
          rack: {
            connect: { id: newrack_id },
          },
        },
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
          rack: {
            include: {
              location: true,
            },
          },
        },
      });
    });

    return NextResponse.json({
      message: "Bunch moved successfully",
      bunch: updatedBunch,
    });
  } catch (error) {
    console.error("Failed to move bunch:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Bunch or rack not found" },
          { status: 404 }
        );
      }
    }
    return NextResponse.json(
      { error: "Failed to move bunch" },
      { status: 500 }
    );
  }
}
