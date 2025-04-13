import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { Prisma } from "@prisma/client";

// Create a new jacket measurement
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
    const measurement = await prisma.jacketMeasurement.create({
      data: {
        measurement_id: measurementId,
        customer_id: customerId,
        orderNo,
        date: order.date,
        jacket_length: body.jacket_length,
        natural_length: body.natural_length,
        back_length: body.back_length,
        x_back: body.x_back,
        half_shoulder: body.half_shoulder,
        to_sleeve: body.to_sleeve,
        chest: body.chest,
        waist: body.waist,
        collar: body.collar,
        waist_coat_length: body.waist_coat_length,
        sherwani_length: body.sherwani_length,
        other_notes: body.other_notes,
      },
    });

    console.log(measurement);

    return NextResponse.json(
      {
        message: "Jacket measurement created successfully",
        measurement_id: measurementId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create jacket measurement:", error);
    return NextResponse.json(
      { error: "Failed to create jacket measurement" },
      { status: 500 }
    );
  }
}

// Update jacket measurement
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { measurementId } = body;

    Object.keys(body).forEach(
      (key) => body[key] === undefined && delete body[key]
    );

    const measurement = await prisma.jacketMeasurement.update({
      where: { measurement_id: measurementId },
      data: body,
    });

    return NextResponse.json({
      message: "Jacket measurement updated successfully",
      measurement,
    });
  } catch (error) {
    console.error("Failed to update jacket measurement:", error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Jacket measurement not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update jacket measurement" },
      { status: 500 }
    );
  }
}
