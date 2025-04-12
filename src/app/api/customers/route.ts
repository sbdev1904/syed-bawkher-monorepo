import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const QuerySchema = z.object({
  page: z.string().transform(Number).default("1"),
  pageSize: z.string().transform(Number).default("10"),
  sortBy: z.string().default("customer_id"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
  search: z.string().optional(),
});

// Get all customers
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const parsed = QuerySchema.parse({
      page: url.searchParams.get("page") ?? "1",
      pageSize: url.searchParams.get("pageSize") ?? "10",
      sortBy: url.searchParams.get("sortBy") ?? "customer_id",
      sortOrder: url.searchParams.get("sortOrder") ?? "asc",
      search: url.searchParams.get("search") ?? undefined,
    });

    const skip = (parsed.page - 1) * parsed.pageSize;

    // Build the where clause based on search
    const where: Prisma.CustomerWhereInput = parsed.search
      ? {
          OR: [
            {
              first_name: {
                contains: parsed.search,
                mode: "insensitive" as Prisma.QueryMode,
              },
            },
            {
              middle_name: {
                contains: parsed.search,
                mode: "insensitive" as Prisma.QueryMode,
              },
            },
            {
              last_name: {
                contains: parsed.search,
                mode: "insensitive" as Prisma.QueryMode,
              },
            },
            { mobile: { contains: parsed.search } },
            { office_phone: { contains: parsed.search } },
            { residential_phone: { contains: parsed.search } },
            {
              email: {
                contains: parsed.search,
                mode: "insensitive" as Prisma.QueryMode,
              },
            },
          ],
        }
      : {};

    const [customers, totalCount] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: parsed.pageSize,
        orderBy: {
          [parsed.sortBy]: parsed.sortOrder,
        },
        include: {
          orders: {
            orderBy: {
              date: "desc",
            },
            take: 1,
          },
          _count: {
            select: {
              orders: true,
            },
          },
        },
      }),
      prisma.customer.count({ where }),
    ]);

    const formattedCustomers = customers.map((customer) => ({
      id: customer.customer_id.toString(),
      name: [customer.first_name, customer.middle_name, customer.last_name]
        .filter(Boolean)
        .join(" "),
      phone:
        customer.mobile ||
        customer.office_phone ||
        customer.residential_phone ||
        "",
      email: customer.email || "",
      totalOrders: customer._count?.orders || 0,
      lastOrder: customer.orders?.[0]?.date?.toISOString().split("T")[0] || "",
    }));

    return NextResponse.json({
      customers: formattedCustomers,
      totalPages: Math.ceil(totalCount / parsed.pageSize),
      currentPage: parsed.page,
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

// Create a new customer
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      first_name,
      last_name,
      mobile,
      add1,
      middle_name,
      add2,
      add3,
      add4,
      email,
      office_phone,
      residential_phone,
      last_ordered_date,
    } = body;

    // Validate required fields
    if (!first_name || !last_name || !mobile) {
      return NextResponse.json(
        {
          error:
            "Missing required fields. First name, last name and mobile number are required.",
        },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.create({
      data: {
        first_name,
        middle_name,
        last_name,
        add1,
        add2,
        add3,
        add4,
        email,
        mobile,
        office_phone,
        residential_phone,
        last_ordered_date: last_ordered_date
          ? new Date(last_ordered_date)
          : null,
      },
    });

    return NextResponse.json(
      { message: "Customer created successfully", customer },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create customer:", error);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }
}
