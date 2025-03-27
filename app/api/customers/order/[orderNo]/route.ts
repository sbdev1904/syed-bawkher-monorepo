import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";

// Get customer by order number
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderNo: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orderNo = (await params).orderNo;

    const order = await prisma.orders.findUnique({
      where: { orderNo },
      include: {
        customer: {
          include: {
            orders: true,
          },
        },
      },
    });

    if (!order || !order.customer) {
      return NextResponse.json(
        { error: "Customer not found for order number: " + orderNo },
        { status: 404 }
      );
    }

    return NextResponse.json(order.customer);
  } catch (error) {
    console.error("Error getting customer by order number:", error);
    return NextResponse.json(
      { error: "Error getting customer by order number" },
      { status: 500 }
    );
  }
}
