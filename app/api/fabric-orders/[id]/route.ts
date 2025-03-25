import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";

// Get a fabric order by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orderId = parseInt(params.id);
    if (isNaN(orderId)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const order = await prisma.fabricOrderList.findUnique({
      where: { order_id: orderId },
      include: {
        fabric: true,
        supplier: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Fabric order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error getting fabric order:", error);
    return NextResponse.json(
      { error: "Error retrieving fabric order" },
      { status: 500 }
    );
  }
}

// Update an existing fabric order
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orderId = parseInt(params.id);
    if (isNaN(orderId)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const body = await req.json();

    // Remove undefined values to avoid Prisma validation errors
    Object.keys(body).forEach(
      (key) => body[key] === undefined && delete body[key]
    );

    // Handle numeric and date fields
    if (body.fabric_id) body.fabric_id = parseInt(body.fabric_id);
    if (body.supplier_id) body.supplier_id = parseInt(body.supplier_id);
    if (body.meters) body.meters = parseFloat(body.meters);
    if (body.ordered_date) body.ordered_date = new Date(body.ordered_date);

    const order = await prisma.fabricOrderList.update({
      where: { order_id: orderId },
      data: body,
    });

    return NextResponse.json({
      message: "Fabric order updated successfully",
      order,
    });
  } catch (error: any) {
    console.error("Failed to update fabric order:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Fabric order not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update fabric order" },
      { status: 500 }
    );
  }
}

// Delete a fabric order
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orderId = parseInt(params.id);
    if (isNaN(orderId)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    await prisma.fabricOrderList.delete({
      where: { order_id: orderId },
    });

    return NextResponse.json({
      message: "Fabric order deleted successfully",
    });
  } catch (error: any) {
    console.error("Failed to delete fabric order:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Fabric order not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete fabric order" },
      { status: 500 }
    );
  }
}
