import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const recentOrders = await prisma.orders.findMany({
      take: 5,
      orderBy: {
        date: "desc",
      },
      include: {
        customer: {
          select: {
            first_name: true,
            middle_name: true,
            last_name: true,
          },
        },
        items: {
          select: {
            item_type: true,
          },
        },
        production: {
          select: {
            status: true,
          },
        },
      },
    });

    const formattedOrders = recentOrders.map((order) => ({
      id: order.orderNo,
      orderNo: order.orderNo,
      customer: {
        name: [
          order.customer?.first_name,
          order.customer?.middle_name,
          order.customer?.last_name,
        ]
          .filter(Boolean)
          .join(" "),
      },
      items: order.items.map((item) => ({
        name: item.item_type,
      })),
      status: order.production?.status || "PATTERN_CUTTING_PENDING",
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent orders" },
      { status: 500 }
    );
  }
}
