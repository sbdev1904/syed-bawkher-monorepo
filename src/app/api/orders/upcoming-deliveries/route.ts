import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ProductionStatus } from "@prisma/client";

export async function GET() {
  try {
    const upcomingDeliveries = await prisma.orders.findMany({
      where: {
        production: {
          status: ProductionStatus.DELIVERY_PENDING,
        },
      },
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
        production: {
          select: {
            updatedAt: true,
          },
        },
      },
    });

    const formattedDeliveries = upcomingDeliveries.map((order) => ({
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
      deliveryDate: order.production?.updatedAt || order.date,
    }));

    return NextResponse.json(formattedDeliveries);
  } catch (error) {
    console.error("Error fetching upcoming deliveries:", error);
    return NextResponse.json(
      { error: "Failed to fetch upcoming deliveries" },
      { status: 500 }
    );
  }
}
