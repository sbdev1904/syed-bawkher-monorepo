import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";

// Get items by order number
export async function GET(
  req: NextRequest,
  { params }: { params: { orderNo: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderNo } = params;

    const items = await prisma.items.findMany({
      where: { orderNo },
      include: {
        order: true,
        fabric: true,
        lining_fabric: true,
        jacket_measurement: true,
        shirt_measurement: true,
        pant_measurement: true,
        final_jacket_measurement: true,
        final_shirt_measurement: true,
        final_pant_measurement: true,
      },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error getting items:", error);
    return NextResponse.json(
      { error: "Error retrieving items" },
      { status: 500 }
    );
  }
}
