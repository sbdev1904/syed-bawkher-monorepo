import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [totalCustomers, newCustomersThisMonth, activeOrders] =
      await Promise.all([
        // Total number of customers
        prisma.customer.count(),

        // New customers this month
        prisma.customer.count({
          where: {
            orders: {
              some: {
                date: {
                  gte: firstDayOfMonth,
                },
              },
            },
          },
        }),

        // Active orders (orders from this month)
        prisma.orders.count({
          where: {
            date: {
              gte: firstDayOfMonth,
            },
          },
        }),
      ]);

    return NextResponse.json({
      totalCustomers,
      newCustomersThisMonth,
      activeOrders,
    });
  } catch (error) {
    console.error("Error fetching customer stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer statistics" },
      { status: 500 }
    );
  }
}
