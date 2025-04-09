import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";

// Search for customers
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

    const customers = await prisma.customer.findMany({
      where: {
        OR: [
          {
            first_name: {
              contains: query,
            },
          },
          {
            middle_name: {
              contains: query,
            },
          },
          {
            last_name: {
              contains: query,
            },
          },
          {
            mobile: {
              equals: query,
            },
          },
          {
            office_phone: {
              equals: query,
            },
          },
          {
            residential_phone: {
              equals: query,
            },
          },
          {
            orders: {
              some: {
                orderNo: {
                  contains: query,
                },
              },
            },
          },
        ],
      },
      include: {
        orders: true,
      },
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Error searching for customers" },
      { status: 500 }
    );
  }
}
