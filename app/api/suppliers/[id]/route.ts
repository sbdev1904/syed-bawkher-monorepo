import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";

// Get a supplier by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supplierId = parseInt(params.id);
    const supplier = await prisma.supplier.findUnique({
      where: { supplier_id: supplierId },
    });

    if (!supplier) {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(supplier);
  } catch (error) {
    console.error("Failed to fetch supplier:", error);
    return NextResponse.json(
      { error: "Failed to fetch supplier" },
      { status: 500 }
    );
  }
}

// Update a supplier
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supplierId = parseInt(params.id);
    const body = await req.json();

    Object.keys(body).forEach(
      (key) => body[key] === undefined && delete body[key]
    );

    const supplier = await prisma.supplier.update({
      where: { supplier_id: supplierId },
      data: body,
    });

    return NextResponse.json({
      message: "Supplier updated successfully",
      supplier,
    });
  } catch (error: any) {
    console.error("Failed to update supplier:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update supplier" },
      { status: 500 }
    );
  }
}

// Delete a supplier
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supplierId = parseInt(params.id);
    await prisma.supplier.delete({
      where: { supplier_id: supplierId },
    });

    return NextResponse.json({
      message: "Supplier deleted successfully",
    });
  } catch (error: any) {
    console.error("Failed to delete supplier:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete supplier" },
      { status: 500 }
    );
  }
}
