import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ProductionStatus } from "@prisma/client";

export async function GET() {
  try {
    const [totalCustomers, activeOrders, inProduction, lowStockItems] =
      await Promise.all([
        prisma.customer.count(),
        prisma.orders.count({
          where: {
            production: {
              status: {
                in: [
                  ProductionStatus.PATTERN_CUTTING_PENDING,
                  ProductionStatus.TAILOR_ASSIGNMENT_PENDING,
                  ProductionStatus.BASE_SUIT_PRODUCTION,
                  ProductionStatus.TRIAL_PENDING,
                  ProductionStatus.FINAL_PRODUCTION,
                  ProductionStatus.FINAL_FITTING_PENDING,
                  ProductionStatus.DELIVERY_PENDING,
                ],
              },
            },
          },
        }),
        prisma.orders.count({
          where: {
            production: {
              status: {
                in: [
                  ProductionStatus.BASE_SUIT_PRODUCTION,
                  ProductionStatus.FINAL_PRODUCTION,
                ],
              },
            },
          },
        }),
        prisma.fabric.count({
          where: {
            available_length: {
              lte: 10, // Assuming 10 meters is our low stock threshold
            },
          },
        }),
      ]);

    return NextResponse.json({
      totalCustomers,
      activeOrders,
      inProduction,
      lowStockItems,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}
