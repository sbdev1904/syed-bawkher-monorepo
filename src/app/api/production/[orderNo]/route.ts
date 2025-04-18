import { NextResponse } from "next/server";
import productionService from "@/services/productionService";

interface RouteParams {
  params: {
    orderNo: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { orderNo } = params;
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

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { orderNo } = params;
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
