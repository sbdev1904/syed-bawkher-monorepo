import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/tailor-assignments/tailor/[tailorId]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ tailorId: string }> }
) {
  try {
    const tailorId = parseInt((await params).tailorId);

    const assignments = await prisma.orderTailor.findMany({
      where: { tailor_id: tailorId },
      include: {
        order: true,
      },
    });

    return NextResponse.json(assignments);
  } catch (error) {
    console.error("Failed to get orders for tailor:", error);
    return NextResponse.json(
      { error: "Failed to get orders for tailor" },
      { status: 500 }
    );
  }
}
