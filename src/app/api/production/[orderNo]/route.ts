import { NextResponse } from "next/server";
import productionService from "@/services/productionService";

interface RouteContext {
  params: Promise<{ orderNo: string }>;
}

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

export async function PATCH(
  request: Request,
  context: RouteContext
): Promise<Response> {
  try {
    const { orderNo } = await context.params;
    const { status, notes } = await request.json();

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

    return NextResponse.json(production);
  } catch (error) {
    console.error("Failed to update production status:", error);
    return NextResponse.json(
      { error: "Failed to update production status" },
      { status: 500 }
    );
  }
}
