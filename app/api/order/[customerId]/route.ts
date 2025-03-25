import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";

// Create a new order
export async function POST(
  req: NextRequest,
  { params }: { params: { customerId: number } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { customerId } = params;
    const body = await req.json();
    const { orderNo, date, note } = body;

    // Validate required fields
    if (!orderNo || !customerId) {
      return NextResponse.json(
        {
          message:
            "Missing required order details. Order number and customer ID are required.",
        },
        { status: 400 }
      );
    }

    const orderDate = date || new Date().toISOString().split("T")[0];

    const order = await prisma.orders.create({
      data: {
        orderNo,
        customer_id: customerId,
        date: orderDate,
        onote: note,
      },
    });

    return NextResponse.json(
      {
        message: "Order created successfully",
        orderNo: order.orderNo,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
