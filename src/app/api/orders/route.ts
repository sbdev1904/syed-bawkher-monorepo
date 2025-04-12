import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";

// Get all orders
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.orders.findMany({
      include: {
        customer: {
          select: {
            customer_id: true,
            first_name: true,
            last_name: true,
          },
        },
        items: {
          select: {
            item_id: true,
            item_name: true,
            item_type: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// Create a new order
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { orderNo, date, note, customerId } = body;

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

    // Ensure we have a full ISO DateTime string
    const orderDate = date
      ? new Date(date).toISOString()
      : new Date().toISOString();

    const order = await prisma.orders.create({
      data: {
        orderNo,
        customer_id: parseInt(customerId, 10),
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
