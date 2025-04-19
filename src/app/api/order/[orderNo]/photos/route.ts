import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";
import {
  S3Client,
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

// Get photos for order
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderNo: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orderNo = (await params).orderNo;

    const photos = await prisma.orderPhotos.findMany({
      where: { orderNo },
      select: { s3_key: true },
    });

    const photoUrls = await Promise.all(
      photos.map(async (photo) => {
        const command = new GetObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: photo.s3_key!,
        });

        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        return { key: photo.s3_key, url };
      })
    );

    return NextResponse.json({ photoUrls });
  } catch (error) {
    console.error("Failed to retrieve order photos:", error);
    return NextResponse.json(
      { error: "Failed to retrieve order photos" },
      { status: 500 }
    );
  }
}

// Delete photo
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ orderNo: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orderNo = (await params).orderNo;

    const body = await req.json();
    const { s3Key } = body;

    // Delete photo from S3
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: s3Key,
    });

    await s3Client.send(command);

    // Delete record from database
    await prisma.orderPhotos.deleteMany({
      where: {
        orderNo,
        s3_key: s3Key,
      },
    });

    return NextResponse.json({
      message: `Photo ${s3Key} for order ${orderNo} deleted successfully.`,
    });
  } catch (error) {
    console.error("Failed to delete photo:", error);
    return NextResponse.json(
      { error: "Failed to delete photo" },
      { status: 500 }
    );
  }
}
