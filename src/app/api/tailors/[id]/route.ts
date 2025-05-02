import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id);
    const tailor = await prisma.tailor.findUnique({
      where: { tailor_id: id },
    });

    if (!tailor) {
      return NextResponse.json({ error: "Tailor not found" }, { status: 404 });
    }

    return NextResponse.json(tailor);
  } catch (error) {
    console.error("Error fetching tailor:", error);
    return NextResponse.json(
      { error: "Failed to fetch tailor" },
      { status: 500 }
    );
  }
}

// Update an existing tailor

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id);
    const data = await request.json();

    const tailor = await prisma.tailor.update({
      where: { tailor_id: id },
      data: {
        ...data,
        hourly_rate: data.hourly_rate ? Number(data.hourly_rate) : undefined,
      },
    });

    return NextResponse.json(tailor);
  } catch (error) {
    console.error("Error updating tailor:", error);
    return NextResponse.json(
      { error: "Failed to update tailor" },
      { status: 500 }
    );
  }
}

// Delete a tailor by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = parseInt((await params).id);
    await prisma.tailor.delete({
      where: { tailor_id: id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting tailor:", error);
    return NextResponse.json(
      { error: "Failed to delete tailor" },
      { status: 500 }
    );
  }
}
