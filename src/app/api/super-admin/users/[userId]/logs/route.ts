import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

// Helper function to check if user is super admin
async function isSuperAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== Role.SUPER_ADMIN) {
    return false;
  }
  return true;
}

// GET user logs
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    if (!(await isSuperAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized. Super Admin access required." },
        { status: 401 }
      );
    }

    const userId = parseInt((await params).userId);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const logs = await prisma.logEntry.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    return NextResponse.json({ logs });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch user logs";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
