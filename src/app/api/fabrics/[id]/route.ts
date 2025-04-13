import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Prisma } from "@prisma/client";
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Get a fabric by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = (await params).id;
    const fabricId = parseInt(id);

    if (isNaN(fabricId)) {
      return NextResponse.json({ error: "Invalid fabric ID" }, { status: 400 });
    }

    const fabric = await prisma.fabric.findUnique({
      where: { fabric_id: fabricId },
      include: {
        fabricOrders: true,
        items: true,
      },
    });

    if (!fabric) {
      return NextResponse.json({ error: "Fabric not found" }, { status: 404 });
    }

    return NextResponse.json(fabric);
  } catch (error) {
    console.error("Error getting fabric:", error);
    return NextResponse.json(
      { error: "Error retrieving fabric" },
      { status: 500 }
    );
  }
}

// Update a fabric
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = (await params).id;
    const fabricId = parseInt(id);

    if (isNaN(fabricId)) {
      return NextResponse.json({ error: "Invalid fabric ID" }, { status: 400 });
    }

    const body = await req.json();

    // Remove undefined values to avoid Prisma validation errors
    Object.keys(body).forEach(
      (key) => body[key] === undefined && delete body[key]
    );

    const fabric = await prisma.fabric.update({
      where: { fabric_id: fabricId },
      data: body,
    });

    return NextResponse.json({
      message: "Fabric updated successfully",
      fabric,
    });
  } catch (error) {
    console.error("Failed to update fabric:", error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Fabric not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to update fabric" },
      { status: 500 }
    );
  }
}

// Delete a fabric
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = (await params).id;
    const fabricId = parseInt(id);

    if (isNaN(fabricId)) {
      return NextResponse.json({ error: "Invalid fabric ID" }, { status: 400 });
    }

    // Get the fabric to check if it has an image
    const fabric = await prisma.fabric.findUnique({
      where: { fabric_id: fabricId },
    });

    if (!fabric) {
      return NextResponse.json({ error: "Fabric not found" }, { status: 404 });
    }

    // Delete the image from S3 if it exists
    if (fabric.image) {
      try {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: fabric.image,
          })
        );
      } catch (error) {
        console.error("Failed to delete fabric image from S3:", error);
      }
    }

    // Delete the fabric from the database
    await prisma.fabric.delete({
      where: { fabric_id: fabricId },
    });

    return NextResponse.json({
      message: "Fabric deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete fabric:", error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json({ error: "Fabric not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete fabric" },
      { status: 500 }
    );
  }
}
