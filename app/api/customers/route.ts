import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";

// Get all customers
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customers = await prisma.customer.findMany({
      include: {
        orders: true,
      },
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

// Create a new customer
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      first_name,
      last_name,
      mobile,
      add1,
      middle_name,
      add2,
      add3,
      add4,
      email,
      office_phone,
      residential_phone,
      last_ordered_date,
    } = body;

    // Validate required fields
    if (!first_name || !last_name || !mobile) {
      return NextResponse.json(
        {
          error:
            "Missing required fields. First name, last name and mobile number are required.",
        },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.create({
      data: {
        first_name,
        middle_name,
        last_name,
        add1,
        add2,
        add3,
        add4,
        email,
        mobile,
        office_phone,
        residential_phone,
        last_ordered_date: last_ordered_date
          ? new Date(last_ordered_date)
          : null,
      },
    });

    return NextResponse.json(
      { message: "Customer created successfully", customer },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create customer:", error);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }
}
