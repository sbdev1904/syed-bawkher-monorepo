import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";

// Create a new pant
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      orderNo,
      item_name,
      pant_measurement_id,
      fabric_id,
      lining_fabric_id,
    } = body;

    const item = await prisma.items.create({
      data: {
        orderNo,
        item_name,
        item_type: "PANT",
        pant_measurement_id,
        fabric_id: fabric_id ? parseInt(fabric_id) : null,
        lining_fabric_id: lining_fabric_id ? parseInt(lining_fabric_id) : null,
      },
    });

    return NextResponse.json(
      {
        message: "Pant created successfully",
        item,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create pant:", error);
    return NextResponse.json(
      { error: "Failed to create pant" },
      { status: 500 }
    );
  }
}
