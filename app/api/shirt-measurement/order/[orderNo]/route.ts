import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";

// Get pant measurements by order number
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderNo: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orderNo = (await params).orderNo;

    const measurements = await prisma.shirtMeasurement.findMany({
      where: { orderNo },
      select: {
        measurement_id: true,
        orderNo: true,
        date: true,
        length: true,
        half_shoulder: true,
        to_sleeve: true,
        chest: true,
        waist: true,
        collar: true,
        other_notes: true,
      },
    });

    return NextResponse.json(measurements);
  } catch (error) {
    console.error("Failed to fetch pant measurements:", error);
    return NextResponse.json(
      { error: "Failed to fetch pant measurements" },
      { status: 500 }
    );
  }
}
