import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";

// Get a raw materials order by ID
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
    const orderId = parseInt(id);

    const order = await prisma.rawMaterialsOrderList.findUnique({
      where: { order_id: orderId },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Raw materials order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Failed to fetch raw materials order:", error);
    return NextResponse.json(
      { error: "Failed to fetch raw materials order" },
      { status: 500 }
    );
  }
}

// Update a raw materials order
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = (await params).id;
    const orderId = parseInt(id);

    const body = await req.json();

    // Remove undefined values to avoid Prisma validation errors
    Object.keys(body).forEach(
      (key) => body[key] === undefined && delete body[key]
    );

    // Convert ordered_date to Date object if present
    if (body.ordered_date) {
      body.ordered_date = new Date(body.ordered_date);
    }

    const order = await prisma.rawMaterialsOrderList.update({
      where: { order_id: orderId },
      data: body,
    });

    return NextResponse.json({
      message: "Raw materials order updated successfully",
      order,
    });
  } catch (error: any) {
    console.error("Failed to update raw materials order:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Raw materials order not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update raw materials order" },
      { status: 500 }
    );
  }
}

// Delete a raw materials order
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = (await params).id;
    const orderId = parseInt(id);

    await prisma.rawMaterialsOrderList.delete({
      where: { order_id: orderId },
    });

    return NextResponse.json({
      message: "Raw materials order deleted successfully",
    });
  } catch (error: any) {
    console.error("Failed to delete raw materials order:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Raw materials order not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete raw materials order" },
      { status: 500 }
    );
  }
}
