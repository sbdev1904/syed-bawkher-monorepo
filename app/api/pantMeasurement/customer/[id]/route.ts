import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";

// Get pant measurements by customer ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = (await params).id;
    const customerId = parseInt(id);

    if (isNaN(customerId)) {
      return NextResponse.json(
        { error: "Invalid customer ID" },
        { status: 400 }
      );
    }

    const measurements = await prisma.pantMeasurement.findMany({
      where: { customer_id: customerId },
      select: {
        measurement_id: true,
        date: true,
        orderNo: true,
        length: true,
        inseem: true,
        waist: true,
        hips: true,
        bottom: true,
        knee: true,
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
