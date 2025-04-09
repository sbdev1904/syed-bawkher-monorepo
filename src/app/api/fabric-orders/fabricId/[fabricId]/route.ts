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

    const id = (await params).fabricId;

    const fabricId = parseInt(id);

    if (isNaN(fabricId)) {
      return NextResponse.json({ error: "Invalid fabric ID" }, { status: 400 });
    }

    const orders = await prisma.fabricOrderList.findMany({
      where: { fabric_id: fabricId },
      include: {
        fabric: true,
        supplier: true,
      },
    });

    if (orders.length === 0) {
      return NextResponse.json(
        { error: "No fabric orders found for the provided fabric ID" },
        { status: 404 }
      );
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error getting fabric orders by fabric ID:", error);
    return NextResponse.json(
      { error: "Error retrieving fabric orders" },
      { status: 500 }
    );
  }
}
