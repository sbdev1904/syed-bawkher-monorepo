import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// Delete a bunch by ID
export async function DELETE(
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

    // Get the bunch with its items and rack
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

    // Calculate total quantity of items in the bunch
    const totalQuantity = bunch.items.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );

    // Delete the bunch and update rack utilization in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete the bunch and its items (cascade delete)
      await tx.bunch.delete({
        where: { id: bunch_id },
      });

      // Update rack utilization
      await tx.rack.update({
        where: { id: bunch.rack_id },
        data: {
          current_utilization: {
            decrement: totalQuantity,
          },
        },
      });
    });

    await prisma.logEntry.create({
      data: {
        action: `Deleted bunch with ID ${bunch_id}`,
        user: { connect: { id: Number(session.user.id) } },
      },
    });

    return NextResponse.json({
      message: "Bunch deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete bunch:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: "Bunch not found" }, { status: 404 });
      }
    }
    return NextResponse.json(
      { error: "Failed to delete bunch" },
      { status: 500 }
    );
  }
}
