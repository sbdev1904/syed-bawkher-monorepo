import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { hash } from "bcrypt";

interface UpdateUserData {
  username: string;
  role: Role;
  password?: string;
}

// Helper function to check if user is super admin
async function isSuperAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== Role.SUPER_ADMIN) {
    return false;
  }
  return true;
}

// GET all users with their logs
export async function GET() {
  try {
    if (!(await isSuperAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized. Super Admin access required." },
        { status: 401 }
      );
    }

    const users = await prisma.user.findMany({
      include: {
        logs: {
          orderBy: {
            timestamp: "desc",
          },
        },
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch users";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// UPDATE user
export async function PUT(request: NextRequest) {
  try {
    if (!(await isSuperAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized. Super Admin access required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, username, role, password } = body;

    const updateData: UpdateUserData = {
      username,
      role,
    };

    if (password) {
      updateData.password = await hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    // Log the action
    await prisma.logEntry.create({
      data: {
        userId: user.id,
        action: "User updated by super admin",
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Reset password
export async function PATCH(request: NextRequest) {
  try {
    if (!(await isSuperAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized. Super Admin access required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, newPassword } = body;

    const hashedPassword = await hash(newPassword, 10);
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { password: hashedPassword },
    });

    // Log the action
    await prisma.logEntry.create({
      data: {
        userId: user.id,
        action: "Password reset by super admin",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to reset password";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
