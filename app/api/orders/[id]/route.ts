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

// Get an order by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const order = await prisma.orders.findUnique({
      where: { orderNo: id },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Failed to fetch order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

// Delete an order and its associated entities
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: orderNo } = params;

    // Get all photos associated with the order
    const photos = await prisma.orderPhotos.findMany({
      where: { orderNo },
      select: { s3_key: true },
    });

    // Delete all associated data in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete photos from S3
      for (const photo of photos) {
        const command = new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: photo.s3_key!,
        });
        await s3Client.send(command);
      }

      // Delete from OrderPhotos
      await tx.orderPhotos.deleteMany({ where: { orderNo } });

      // Delete from Items
      await tx.items.deleteMany({ where: { orderNo } });

      // Delete from FinalPantMeasurement
      await tx.finalPantMeasurement.deleteMany({ where: { orderNo } });

      // Delete from PantMeasurement
      await tx.pantMeasurement.deleteMany({ where: { orderNo } });

      // Delete from FinalShirtMeasurement
      await tx.finalShirtMeasurement.deleteMany({ where: { orderNo } });

      // Delete from ShirtMeasurement
      await tx.shirtMeasurement.deleteMany({ where: { orderNo } });

      // Delete from FinalJacketMeasurement
      await tx.finalJacketMeasurement.deleteMany({ where: { orderNo } });

      // Delete from JacketMeasurement
      await tx.jacketMeasurement.deleteMany({ where: { orderNo } });

      // Finally, delete the order
      await tx.orders.delete({ where: { orderNo } });
    });

    return NextResponse.json({
      message: `Order ${orderNo} and all associated entities have been deleted successfully.`,
    });
  } catch (error: any) {
    console.error("Failed to delete order:", error);
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    );
  }
}
