import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/tailor-assignments/order/[orderNo]
export async function GET(
  request: Request,
  { params }: { params: { orderNo: string } }
) {
  try {
    const { orderNo } = params;

    const assignments = await prisma.orderTailor.findMany({
      where: { orderNo },
      include: {
        tailor: true,
      },
    });

    return NextResponse.json(assignments);
  } catch (error) {
    console.error("Failed to get tailors for order:", error);
    return NextResponse.json(
      { error: "Failed to get tailors for order" },
      { status: 500 }
    );
  }
}
