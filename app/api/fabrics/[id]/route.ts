import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

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
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const fabricId = parseInt(params.id);
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

// Update an existing fabric
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const fabricId = parseInt(params.id);
    if (isNaN(fabricId)) {
      return NextResponse.json({ error: "Invalid fabric ID" }, { status: 400 });
    }

    const body = await req.json();

    // Remove undefined values to avoid Prisma validation errors
    Object.keys(body).forEach(
      (key) => body[key] === undefined && delete body[key]
    );

    // Handle numeric fields
    if (body.available_length) {
      body.available_length = parseFloat(body.available_length);
    }

    const fabric = await prisma.fabric.update({
      where: { fabric_id: fabricId },
      data: body,
    });

    return NextResponse.json({
      message: "Fabric updated successfully",
      fabric,
    });
  } catch (error: any) {
    console.error("Failed to update fabric:", error);
    if (error.code === "P2025") {
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
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const fabricId = parseInt(params.id);
    if (isNaN(fabricId)) {
      return NextResponse.json({ error: "Invalid fabric ID" }, { status: 400 });
    }

    // Start a transaction to handle the deletion
    await prisma.$transaction(async (tx) => {
      // Get the fabric to check for image
      const fabric = await tx.fabric.findUnique({
        where: { fabric_id: fabricId },
      });

      // Delete image from S3 if it exists
      if (fabric?.image) {
        const command = new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: fabric.image,
        });
        await s3Client.send(command);
      }

      // Delete related fabric orders
      await tx.fabricOrderList.deleteMany({
        where: { fabric_id: fabricId },
      });

      // Delete the fabric
      await tx.fabric.delete({
        where: { fabric_id: fabricId },
      });
    });

    return NextResponse.json({
      message: "Fabric deleted successfully",
    });
  } catch (error: any) {
    console.error("Failed to delete fabric:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Fabric not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete fabric" },
      { status: 500 }
    );
  }
}
