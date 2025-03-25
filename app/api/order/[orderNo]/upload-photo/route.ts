import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Get presigned URL for photo upload
export async function POST(
  req: NextRequest,
  { params }: { params: { orderNo: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderNo } = params;
    const body = await req.json();
    const { filename } = body;

    // Check photo count
    const photoCount = await prisma.orderPhotos.count({
      where: { orderNo },
    });

    if (photoCount >= 5) {
      return NextResponse.json(
        { message: "Maximum of 5 photos can be uploaded per order." },
        { status: 400 }
      );
    }

    const s3Key = `orders/${orderNo}/${filename}`;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: s3Key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    // Create record in OrderPhotos
    await prisma.orderPhotos.create({
      data: {
        orderNo,
        s3_key: s3Key,
      },
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Failed to generate presigned URL:", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 }
    );
  }
}
