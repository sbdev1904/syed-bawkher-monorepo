import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";

// Get all fabric orders by fabric ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ fabricId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fabricId: fabricIdStr } = await params;
    const fabricId = parseInt(fabricIdStr);

    if (isNaN(fabricId)) {
      return NextResponse.json(
        { error: "Invalid fabric ID format" },
        { status: 400 }
      );
    }

    const orders = await prisma.fabricOrderList.findMany({
      where: { fabric_id: fabricId },
      include: {
        fabric: true,
        supplier: true,
      },
    });

    if (!orders || orders.length === 0) {
      return NextResponse.json([]);
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error getting fabric orders by fabric ID:", error);
    return NextResponse.json(
      {
        error: "Error retrieving fabric orders",
        details:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
