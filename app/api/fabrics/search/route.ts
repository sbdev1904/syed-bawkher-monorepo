import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";

// Search fabrics
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchUrl = new URL(req.url);
    const query = searchUrl.searchParams.get("query");

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    const fabrics = await prisma.fabric.findMany({
      where: {
        OR: [
          {
            fabric_code: {
              contains: query,
            },
          },
          {
            fabric_brand: {
              contains: query,
            },
          },
          {
            description: {
              contains: query,
            },
          },
          {
            fabric_id: isNaN(parseInt(query)) ? undefined : parseInt(query),
          },
          {
            barcode: {
              contains: query,
            },
          },
          {
            stock_location: {
              contains: query,
            },
          },
        ],
      },
      include: {
        fabricOrders: true,
        items: true,
      },
    });

    return NextResponse.json(fabrics);
  } catch (error) {
    console.error("Error searching fabrics:", error);
    return NextResponse.json(
      { error: "Error searching fabrics" },
      { status: 500 }
    );
  }
}
