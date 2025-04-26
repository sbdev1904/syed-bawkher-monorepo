import { NextResponse } from "next/server";
import productionService from "@/services/productionService";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

interface RouteContext {
  params: Promise<{ orderNo: string }>;
}

// Get production status by order number
export async function GET(
  request: Request,
  context: RouteContext
): Promise<Response> {
  try {
    const { orderNo } = await context.params;
    const production = await productionService.getProductionStatus(orderNo);

    if (!production) {
      return NextResponse.json(
        { error: "Production not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(production);
  } catch (error) {
    console.error("Failed to fetch production status:", error);
    return NextResponse.json(
      { error: "Failed to fetch production status" },
      { status: 500 }
    );
  }
}

// Update production status
export async function PATCH(
  request: Request,
  context: RouteContext
): Promise<Response> {
  try {
    const { orderNo } = await context.params;
    const { status, notes } = await request.json();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    const production = await productionService.updateProductionStatus({
      orderNo,
      status,
      notes,
    });

    await prisma.logEntry.create({
      data: {
        action: `Updated production status for order ${orderNo} to ${status}`,
        user: { connect: { id: Number(session.user.id) } },
      },
    });

    return NextResponse.json(production);
  } catch (error) {
    console.error("Failed to update production status:", error);
    return NextResponse.json(
      { error: "Failed to update production status" },
      { status: 500 }
    );
  }
}
