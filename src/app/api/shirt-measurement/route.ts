import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { Prisma } from "@prisma/client";

// Create a new shirt measurement
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
    const measurement = await prisma.shirtMeasurement.create({
      data: {
        measurement_id: measurementId,
        customer_id: parseInt(customerId),
        orderNo,
        date: order.date,
        length: body.length,
        half_shoulder: body.half_shoulder,
        to_sleeve: body.to_sleeve,
        chest: body.chest,
        waist: body.waist,
        collar: body.collar,
        other_notes: body.other_notes,
      },
    });

    console.log(measurement);

    return NextResponse.json(
      {
        message: "Shirt measurement created successfully",
        measurement_id: measurementId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create shirt measurement:", error);
    return NextResponse.json(
      { error: "Failed to create shirt measurement" },
      { status: 500 }
    );
  }
}

// Update shirt measurement
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

    const measurement = await prisma.shirtMeasurement.update({
      where: { measurement_id: measurementId },
      data: body,
    });

    return NextResponse.json({
      message: "Shirt measurement updated successfully",
      measurement,
    });
  } catch (error) {
    console.error("Failed to update shirt measurement:", error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Shirt measurement not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update shirt measurement" },
      { status: 500 }
    );
  }
}
