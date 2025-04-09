import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";

// Get all items
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const items = await prisma.items.findMany({
      include: {
        order: true,
        fabric: true,
        lining_fabric: true,
        jacket_measurement: true,
        shirt_measurement: true,
        pant_measurement: true,
        final_jacket_measurement: true,
        final_shirt_measurement: true,
        final_pant_measurement: true,
      },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error getting items:", error);
    return NextResponse.json(
      { error: "Error retrieving items" },
      { status: 500 }
    );
  }
}

// Create multiple items for the same order
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { orderNo, items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    // Start a transaction to handle multiple items
    const results = await prisma.$transaction(async (tx) => {
      const createdItems = [];

      for (const item of items) {
        const {
          item_name,
          item_type,
          measurement_id,
          fabric_id,
          lining_fabric_id,
        } = item;

        // Create the item based on its type
        const measurementField = `${item_type.toLowerCase()}_measurement_id`;

        const createdItem = await tx.items.create({
          data: {
            orderNo,
            item_name,
            item_type: item_type.toUpperCase(),
            fabric_id: fabric_id ? parseInt(fabric_id) : null,
            lining_fabric_id: lining_fabric_id
              ? parseInt(lining_fabric_id)
              : null,
            ...(item_type.toLowerCase() === "jacket" && {
              jacket_measurement_id: measurement_id,
            }),
            ...(item_type.toLowerCase() === "shirt" && {
              shirt_measurement_id: measurement_id,
            }),
            ...(item_type.toLowerCase() === "pant" && {
              pant_measurement_id: measurement_id,
            }),
          },
        });

        createdItems.push(createdItem);
      }

      return createdItems;
    });

    return NextResponse.json(
      {
        message: "Items created successfully",
        itemsCreated: results.length,
        items: results,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create items:", error);
    return NextResponse.json(
      { error: "Failed to create items" },
      { status: 500 }
    );
  }
}
