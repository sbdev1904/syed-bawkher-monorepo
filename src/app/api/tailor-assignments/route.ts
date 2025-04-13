import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST /api/tailor-assignments - Assign tailor to order
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderNo, tailorId, dueDate, notes } = body;

    const assignment = await prisma.orderTailor.create({
      data: {
        orderNo,
        tailor_id: tailorId,
        due_date: dueDate ? new Date(dueDate) : undefined,
        notes,
        status: "ASSIGNED",
      },
      include: {
        tailor: true,
        order: true,
      },
    });

    return NextResponse.json(assignment);
  } catch (error) {
    console.error("Failed to assign tailor to order:", error);
    return NextResponse.json(
      { error: "Failed to assign tailor to order" },
      { status: 500 }
    );
  }
}

// PUT /api/tailor-assignments - Update assignment status
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { orderNo, tailorId, status, notes } = body;

    const assignment = await prisma.orderTailor.updateMany({
      where: {
        orderNo,
        tailor_id: tailorId,
      },
      data: {
        status,
        notes,
      },
    });

    return NextResponse.json(assignment);
  } catch (error) {
    console.error("Failed to update assignment status:", error);
    return NextResponse.json(
      { error: "Failed to update assignment status" },
      { status: 500 }
    );
  }
}

// DELETE /api/tailor-assignments - Remove tailor from order
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { orderNo, tailorId } = body;

    const assignment = await prisma.orderTailor.deleteMany({
      where: {
        orderNo,
        tailor_id: tailorId,
      },
    });

    return NextResponse.json(assignment);
  } catch (error) {
    console.error("Failed to remove tailor from order:", error);
    return NextResponse.json(
      { error: "Failed to remove tailor from order" },
      { status: 500 }
    );
  }
}
