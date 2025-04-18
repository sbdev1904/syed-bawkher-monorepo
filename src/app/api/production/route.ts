import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ProductionStatus } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderNo = searchParams.get("orderNo");

  if (!orderNo) {
    return NextResponse.json(
      { error: "Order number is required" },
      { status: 400 }
    );
  }

  try {
    const production = await prisma.orderProduction.findUnique({
      where: { orderNo },
      include: {
        order: {
          include: {
            customer: true,
            tailors: {
              include: {
                tailor: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(production);
  } catch (error) {
    console.error("Error fetching production status:", error);
    return NextResponse.json(
      { error: "Failed to fetch production status" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderNo = searchParams.get("orderNo");

  if (!orderNo) {
    return NextResponse.json(
      { error: "Order number is required" },
      { status: 400 }
    );
  }

  try {
    // Check if production tracking already exists
    const existing = await prisma.orderProduction.findUnique({
      where: { orderNo },
    });

    if (existing) {
      return NextResponse.json(existing);
    }

    const production = await prisma.orderProduction.create({
      data: {
        orderNo,
        status: "PATTERN_CUTTING_PENDING",
      },
    });

    return NextResponse.json(production);
  } catch (error) {
    console.error("Error initializing production:", error);
    return NextResponse.json(
      { error: "Failed to initialize production" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { orderNo, status, notes } = body;

  if (!orderNo || !status) {
    return NextResponse.json(
      { error: "Order number and status are required" },
      { status: 400 }
    );
  }

  try {
    const production = await prisma.orderProduction.update({
      where: { orderNo },
      data: {
        status: status as ProductionStatus,
        notes,
      },
    });

    return NextResponse.json(production);
  } catch (error) {
    console.error("Error updating production status:", error);
    return NextResponse.json(
      { error: "Failed to update production status" },
      { status: 500 }
    );
  }
}
