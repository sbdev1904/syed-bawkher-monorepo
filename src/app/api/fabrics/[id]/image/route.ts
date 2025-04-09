import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Get fabric image URL
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
    });

    if (!fabric?.image) {
      return NextResponse.json(
        { error: "Image not found for the specified fabric" },
        { status: 404 }
      );
    }

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: fabric.image,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Failed to retrieve fabric image URL:", error);
    return NextResponse.json(
      { error: "Failed to retrieve fabric image URL" },
      { status: 500 }
    );
  }
}

// Generate upload URL for fabric image
export async function POST(
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
    const { filename } = body;

    if (!filename) {
      return NextResponse.json(
        { error: "Filename is required" },
        { status: 400 }
      );
    }

    const s3Key = `fabrics/${fabricId}/${filename}`;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: s3Key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    // Update the fabric record with the new image key
    await prisma.fabric.update({
      where: { fabric_id: fabricId },
      data: { image: s3Key },
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Failed to generate presigned URL for fabric image:", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 }
    );
  }
}

// Delete fabric image
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

    // Start a transaction to handle both S3 and database operations
    await prisma.$transaction(async (tx) => {
      const fabric = await tx.fabric.findUnique({
        where: { fabric_id: fabricId },
      });

      if (!fabric?.image) {
        throw new Error("Image not found for the specified fabric");
      }

      // Delete from S3
      const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: fabric.image,
      });
      await s3Client.send(command);

      // Update database
      await tx.fabric.update({
        where: { fabric_id: fabricId },
        data: { image: null },
      });
    });

    return NextResponse.json({
      message: `Image for fabric ${fabricId} deleted successfully`,
    });
  } catch (error: any) {
    console.error("Failed to delete fabric image:", error);
    if (error.message === "Image not found for the specified fabric") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete fabric image" },
      { status: 500 }
    );
  }
}
