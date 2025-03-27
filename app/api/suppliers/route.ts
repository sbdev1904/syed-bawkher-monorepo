import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";

// Get all suppliers
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const suppliers = await prisma.supplier.findMany();
    return NextResponse.json(suppliers);
  } catch (error) {
    console.error("Failed to fetch suppliers:", error);
    return NextResponse.json(
      { error: "Failed to fetch suppliers" },
      { status: 500 }
    );
  }
}

// Create a new supplier
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      supplier_name,
      add1,
      add2,
      add3,
      phone_number1,
      phone_number2,
      phone_number3,
      email,
      primary_contact_name1,
      primary_contact_name2,
      primary_contact_name3,
      notes,
    } = body;

    if (!supplier_name) {
      return NextResponse.json(
        {
          error: "Missing required field: supplier_name",
        },
        { status: 400 }
      );
    }

    const supplier = await prisma.supplier.create({
      data: {
        supplier_name,
        add1,
        add2,
        add3,
        phone_number1,
        phone_number2,
        phone_number3,
        email,
        primary_contact_name1,
        primary_contact_name2,
        primary_contact_name3,
        notes,
      },
    });

    return NextResponse.json(
      {
        message: "Supplier created successfully",
        supplierId: supplier.supplier_id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create supplier:", error);
    return NextResponse.json(
      { error: "Failed to create supplier" },
      { status: 500 }
    );
  }
}
