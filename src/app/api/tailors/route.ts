import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const tailors = await prisma.tailor.findMany({
      orderBy: {
        first_name: "asc",
      },
    });
    return NextResponse.json(tailors);
  } catch (error) {
    console.error("Error fetching tailors:", error);
    return NextResponse.json(
      { error: "Failed to fetch tailors" },
      { status: 500 }
    );
  }
}

// Create a new tailor
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const tailor = await prisma.tailor.create({
      data: {
        ...data,
        hourly_rate: data.hourly_rate ? Number(data.hourly_rate) : null,
      },
    });
    return NextResponse.json(tailor);
  } catch (error) {
    console.error("Error creating tailor:", error);
    return NextResponse.json(
      { error: "Failed to create tailor" },
      { status: 500 }
    );
  }
}
