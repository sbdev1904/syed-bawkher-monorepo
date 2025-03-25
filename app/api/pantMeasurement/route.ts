import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

// Create a new pant measurement
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { customerId, orderNo } = body;

    // Get order date
    const order = await prisma.orders.findUnique({
      where: { orderNo },
      select: { date: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const measurementId = uuidv4();
    const measurement = await prisma.pantMeasurement.create({
      data: {
        measurement_id: measurementId,
        customer_id: customerId,
        orderNo,
        date: order.date,
        length: body.length,
        inseem: body.inseem,
        waist: body.waist,
        hips: body.hips,
        bottom: body.bottom,
        knee: body.knee,
        other_notes: body.other_notes,
      },
    });

    return NextResponse.json(
      {
        message: "Pant measurement created successfully",
        measurement_id: measurementId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create pant measurement:", error);
    return NextResponse.json(
      { error: "Failed to create pant measurement" },
      { status: 500 }
    );
  }
}

// Update pant measurement
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const { measurementId } = body;

    // Remove undefined values to avoid Prisma validation errors
    Object.keys(body).forEach(
      (key) => body[key] === undefined && delete body[key]
    );

    const measurement = await prisma.pantMeasurement.update({
      where: { measurement_id: measurementId },
      data: body,
    });

    return NextResponse.json({
      message: "Pant measurement updated successfully",
      measurement,
    });
  } catch (error: any) {
    console.error("Failed to update pant measurement:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Pant measurement not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update pant measurement" },
      { status: 500 }
    );
  }
}
