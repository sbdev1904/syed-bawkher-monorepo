import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";

// Get all fabric orders
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.fabricOrderList.findMany({
      include: {
        fabric: true,
        supplier: true,
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error getting fabric orders:", error);
    return NextResponse.json(
      { error: "Error retrieving fabric orders" },
      { status: 500 }
    );
  }
}

// Create a new fabric order
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      fabric_id,
      description,
      supplier_name,
      supplier_id,
      meters,
      ordered_date,
      ordered_for,
    } = body;

    const order = await prisma.fabricOrderList.create({
      data: {
        fabric_id: fabric_id ? parseInt(fabric_id) : null,
        description,
        supplier_name,
        supplier_id: supplier_id ? parseInt(supplier_id) : null,
        meters: meters ? parseFloat(meters) : null,
        ordered_date: ordered_date ? new Date(ordered_date) : null,
        ordered_for,
      },
    });

    return NextResponse.json(
      {
        message: "Fabric order created successfully",
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create fabric order:", error);
    return NextResponse.json(
      {
        error: "Failed to create fabric order",
      },
      { status: 500 }
    );
  }
}
