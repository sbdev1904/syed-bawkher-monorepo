import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const productions = await prisma.orderProduction.findMany({
      select: {
        id: true,
        orderNo: true,
        status: true,
        notes: true,
        order: {
          select: {
            date: true,
            customer: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
            items: {
              select: {
                item_name: true,
              },
            },
            tailors: {
              select: {
                tailor: {
                  select: {
                    first_name: true,
                    last_name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    // Transform the data to match the expected structure and ensure id is a string
    const transformedProductions = productions.map((prod) => ({
      id: prod.id.toString(),
      orderNo: prod.orderNo,
      status: prod.status,
      notes: prod.notes,
      customer: prod.order.customer,
      items: prod.order.items,
      tailors: prod.order.tailors,
      order: {
        date: prod.order.date,
      },
    }));

    return NextResponse.json(transformedProductions);
  } catch (error) {
    console.error("Error fetching all production status:", error);
    return NextResponse.json(
      { error: "Failed to fetch all production status" },
      { status: 500 }
    );
  }
}
