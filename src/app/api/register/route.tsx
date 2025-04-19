import { NextResponse, NextRequest } from "next/server";

import prisma from "@/lib/prisma";
import { Role, User } from "@prisma/client";

import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const body: User = await req.json();
    const { username, password } = body;

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        role: Role.ADMIN,
        password: hashedPassword, // Store the hashed password
      },
    });

    console.log("User created successfully");

    return NextResponse.json(
      {
        message: "success",
        data: user,
      },
      { status: 200 }
    );
  } catch (e) {
    if (e instanceof Error) {
      console.log("Error while creating user :: ", e.message);
      return NextResponse.json(
        { message: "Failed", error: e.message },
        { status: 500 }
      );
    }
    console.log("Error while creating user :: ", e);
    return NextResponse.json(
      { message: "Failed", error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
