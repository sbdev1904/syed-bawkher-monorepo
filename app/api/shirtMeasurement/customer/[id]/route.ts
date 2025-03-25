import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";

// Get shirt measurements by customer ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customerId = params.id;

    const measurements = await prisma.shirtMeasurement.findMany({
      where: { customer_id: customerId },
      select: {
        measurement_id: true,
        date: true,
        orderNo: true,
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
    console.error("Failed to fetch shirt measurements:", error);
    return NextResponse.json(
      { error: "Failed to fetch shirt measurements" },
      { status: 500 }
    );
  }
}
