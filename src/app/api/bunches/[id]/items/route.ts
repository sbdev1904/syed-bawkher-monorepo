import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// Add items to a bunch
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bunch_id = parseInt((await params).id);
    if (isNaN(bunch_id)) {
      return NextResponse.json({ error: "Invalid bunch ID" }, { status: 400 });
    }

    const { items } = await req.json();
    console.log(items);
    if (!Array.isArray(items)) {
      console.log("Items is not an array");
      return NextResponse.json(
        { error: "Items must be an array" },
        { status: 400 }
      );
    }

    // Get the bunch with its rack to check capacity
    const bunch = await prisma.bunch.findUnique({
      where: { id: bunch_id },
      include: {
        rack: true,
        items: true,
      },
    });

    if (!bunch) {
      return NextResponse.json({ error: "Bunch not found" }, { status: 404 });
    }

    // Calculate total quantity of new items
    const totalNewQuantity = items.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );

    console.log("Total new quantity", totalNewQuantity);

    const currentQuantity = bunch.items.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );

    console.log("Current quantity", currentQuantity);

    const totalQuantity = currentQuantity + totalNewQuantity;

    console.log("Total quantity", totalQuantity);

    // Check if adding these items would exceed rack capacity
    if (totalQuantity > bunch.rack.capacity) {
      console.log("Total quantity exceeds rack capacity");
      return NextResponse.json(
        {
          error: "Adding these items would exceed rack capacity",
          current_utilization: currentQuantity,
          capacity: bunch.rack.capacity,
          requestedQuantity: totalNewQuantity,
        },
        { status: 400 }
      );
    }

    // Validate each item has required fields
    for (const item of items) {
      console.log("Item", item);
      if (!item.name || !item.type || !item.quantity || !item.unit) {
        console.log("Item is missing required fields");
        return NextResponse.json(
          {
            error: "Each item must have name, type, quantity, and unit",
            invalidItem: item,
          },
          { status: 400 }
        );
      }
    }

    // Add items to the bunch and update rack utilization
    const updatedBunch = await prisma.$transaction(async (tx) => {
      // Update rack utilization
      await tx.rack.update({
        where: { id: bunch.rack_id },
        data: {
          current_utilization: totalQuantity,
        },
      });

      // Add items to the bunch
      return await tx.bunch.update({
        where: { id: bunch_id },
        data: {
          items: {
            create: items.map((item) => ({
              item_name: item.name,
              item_type: item.type,
              quantity: item.quantity,
              unit_id: item.unit_id,
              ...(item.supplier_id && {
                suppliers: {
                  create: {
                    supplier_id: item.supplier_id,
                  },
                },
              }),
            })),
          },
        },
        include: {
          items: {
            include: {
              unit: true,
              suppliers: {
                include: {
                  supplier: true,
                },
              },
            },
          },
          rack: {
            include: {
              location: true,
            },
          },
        },
      });
    });

    return NextResponse.json({
      message: "Items added successfully",
      bunch: updatedBunch,
    });
  } catch (error) {
    console.error("Failed to add items to bunch:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: "Bunch not found" }, { status: 404 });
      }
    }
    return NextResponse.json(
      { error: "Failed to add items to bunch" },
      { status: 500 }
    );
  }
}

// Update items in a bunch
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bunch_id = parseInt((await params).id);
    if (isNaN(bunch_id)) {
      return NextResponse.json({ error: "Invalid bunch ID" }, { status: 400 });
    }

    const { items } = await req.json();
    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Items must be an array" },
        { status: 400 }
      );
    }

    // Update each item
    const updatePromises = items.map((item) =>
      prisma.items.update({
        where: { item_id: item.id },
        data: {
          item_name: item.name,
          item_type: item.type,
          quantity: item.quantity,
          unit_id: item.unit_id,
          ...(item.supplier_id && {
            suppliers: {
              upsert: {
                where: {
                  item_id_supplier_id: {
                    item_id: item.id,
                    supplier_id: item.supplier_id,
                  },
                },
                create: {
                  supplier_id: item.supplier_id,
                },
                update: {},
              },
            },
          }),
        },
      })
    );

    await Promise.all(updatePromises);

    const updatedBunch = await prisma.bunch.findUnique({
      where: { id: bunch_id },
      include: {
        items: {
          include: {
            unit: true,
            suppliers: {
              include: {
                supplier: true,
              },
            },
          },
        },
        rack: {
          include: {
            location: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Items updated successfully",
      bunch: updatedBunch,
    });
  } catch (error) {
    console.error("Failed to update items in bunch:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "Bunch or item not found" },
          { status: 404 }
        );
      }
    }
    return NextResponse.json(
      { error: "Failed to update items in bunch" },
      { status: 500 }
    );
  }
}

// Remove items from a bunch
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bunch_id = parseInt((await params).id);
    if (isNaN(bunch_id)) {
      return NextResponse.json({ error: "Invalid bunch ID" }, { status: 400 });
    }

    const { item_ids } = await req.json();
    if (!Array.isArray(item_ids)) {
      return NextResponse.json(
        { error: "Item IDs must be an array" },
        { status: 400 }
      );
    }

    // Delete the specified items
    await prisma.inventoryItem.deleteMany({
      where: {
        item_id: { in: item_ids },
        bunch_id: bunch_id,
      },
    });

    const updatedBunch = await prisma.bunch.findUnique({
      where: { id: bunch_id },
      include: {
        items: {
          include: {
            unit: true,
            suppliers: {
              include: {
                supplier: true,
              },
            },
          },
        },
        rack: {
          include: {
            location: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Items removed successfully",
      bunch: updatedBunch,
    });
  } catch (error) {
    console.error("Failed to remove items from bunch:", error);
    return NextResponse.json(
      { error: "Failed to remove items from bunch" },
      { status: 500 }
    );
  }
}
