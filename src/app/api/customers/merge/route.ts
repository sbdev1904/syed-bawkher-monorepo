import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";

// Merge customers
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { customerIds } = await req.json();

    if (!Array.isArray(customerIds) || customerIds.length < 2) {
      return NextResponse.json(
        {
          error:
            "You must provide an array of at least two customer IDs to merge.",
        },
        { status: 400 }
      );
    }

    const targetCustomerId = customerIds[0];
    const sourceCustomerIds = customerIds.slice(1);

    // Start a transaction to handle the merge
    await prisma.$transaction(async (tx) => {
      // Update all related records to point to the target customer
      const updatePromises = [
        tx.orders.updateMany({
          where: {
            customer_id: {
              in: sourceCustomerIds,
            },
          },
          data: {
            customer_id: targetCustomerId,
          },
        }),
        tx.finalJacketMeasurement.updateMany({
          where: {
            customer_id: {
              in: sourceCustomerIds,
            },
          },
          data: {
            customer_id: targetCustomerId,
          },
        }),
        tx.finalPantMeasurement.updateMany({
          where: {
            customer_id: {
              in: sourceCustomerIds,
            },
          },
          data: {
            customer_id: targetCustomerId,
          },
        }),
        tx.finalShirtMeasurement.updateMany({
          where: {
            customer_id: {
              in: sourceCustomerIds,
            },
          },
          data: {
            customer_id: targetCustomerId,
          },
        }),
        tx.jacketMeasurement.updateMany({
          where: {
            customer_id: {
              in: sourceCustomerIds,
            },
          },
          data: {
            customer_id: targetCustomerId,
          },
        }),
        tx.pantMeasurement.updateMany({
          where: {
            customer_id: {
              in: sourceCustomerIds,
            },
          },
          data: {
            customer_id: targetCustomerId,
          },
        }),
        tx.shirtMeasurement.updateMany({
          where: {
            customer_id: {
              in: sourceCustomerIds,
            },
          },
          data: {
            customer_id: targetCustomerId,
          },
        }),
      ];

      // Execute all updates in parallel
      await Promise.all(updatePromises);

      // Delete the source customers
      await tx.customer.deleteMany({
        where: {
          customer_id: {
            in: sourceCustomerIds,
          },
        },
      });
    });

    return NextResponse.json({
      message:
        "Customers merged successfully into customer ID: " + targetCustomerId,
    });
  } catch (error) {
    console.error("Failed to merge customers:", error);
    return NextResponse.json(
      { error: "Failed to merge customers" },
      { status: 500 }
    );
  }
}
