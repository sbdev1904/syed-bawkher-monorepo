import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
// Get an item by ID
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
    const itemId = parseInt(id);

    if (isNaN(itemId)) {
      return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
    }

    const item = await prisma.items.findUnique({
      where: { item_id: itemId },
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

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error getting item:", error);
    return NextResponse.json(
      { error: "Error retrieving item" },
      { status: 500 }
    );
  }
}

// Update an existing item
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
    const itemId = parseInt(id);

    if (isNaN(itemId)) {
      return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
    }

    const body = await req.json();

    // Remove undefined values to avoid Prisma validation errors
    Object.keys(body).forEach(
      (key) => body[key] === undefined && delete body[key]
    );

    // Handle numeric fields
    if (body.fabric_id) body.fabric_id = parseInt(body.fabric_id);
    if (body.lining_fabric_id)
      body.lining_fabric_id = parseInt(body.lining_fabric_id);

    const item = await prisma.items.update({
      where: { item_id: itemId },
      data: body,
    });

    return NextResponse.json({
      message: "Item updated successfully",
      item,
    });
  } catch (error) {
    console.error("Failed to update item:", error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}

// Delete an item
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
    const itemId = parseInt(id);

    if (isNaN(itemId)) {
      return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
    }

    await prisma.items.delete({
      where: { item_id: itemId },
    });

    return NextResponse.json({
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete item:", error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
