import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";

// Get all raw materials orders
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.rawMaterialsOrderList.findMany();
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to fetch raw materials orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch raw materials orders" },
      { status: 500 }
    );
  }
}

// Create a new raw materials order
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      product_name,
      description,
      raw_material_code,
      color,
      supplier_name,
      supplier_id,
      quantity,
      ordered_date,
    } = body;

    const order = await prisma.rawMaterialsOrderList.create({
      data: {
        product_name,
        description,
        raw_material_code,
        color,
        supplier_name,
        supplier_id,
        quantity,
        ordered_date: ordered_date ? new Date(ordered_date) : new Date(),
      },
    });

    return NextResponse.json(
      {
        message: "Raw materials order created successfully",
        orderId: order.order_id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create raw materials order:", error);
    return NextResponse.json(
      { error: "Failed to create raw materials order" },
      { status: 500 }
    );
  }
}
