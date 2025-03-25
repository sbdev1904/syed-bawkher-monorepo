import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";

// Get all fabrics
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const fabrics = await prisma.fabric.findMany({
      include: {
        fabricOrders: true,
        items: true,
      },
    });

    return NextResponse.json(fabrics);
  } catch (error) {
    console.error("Error getting fabrics:", error);
    return NextResponse.json(
      { error: "Error retrieving fabrics" },
      { status: 500 }
    );
  }
}

// Create a new fabric
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      description,
      available_length,
      fabric_code,
      fabric_brand,
      stock_location,
      image,
      barcode,
    } = body;

    const fabric = await prisma.fabric.create({
      data: {
        description,
        available_length: available_length
          ? parseFloat(available_length)
          : null,
        fabric_code,
        fabric_brand,
        stock_location,
        image,
        barcode,
      },
    });

    return NextResponse.json(
      {
        message: "Fabric created successfully",
        fabric,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create fabric:", error);
    return NextResponse.json(
      { error: "Failed to create fabric" },
      { status: 500 }
    );
  }
}
