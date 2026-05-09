import { NextResponse } from "next/server";
import { connectDB, User } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET() {
  try {
    const session = await requireAuth();
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(session.userId)) {
      const response = NextResponse.json({ error: "Invalid session" }, { status: 401 });
      response.cookies.set("token", "", { maxAge: 0 });
      return response;
    }

    const user = await User.findById(session.userId).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { password, ...safeUser } = user as any;

    return NextResponse.json({ user: safeUser });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await requireAuth();
    await connectDB();

    const data = await request.json();
    const updateData: Record<string, string> = {};

    if (data.name) updateData.name = data.name;
    if (data.avatar) updateData.avatar = data.avatar;

    const user = await User.findByIdAndUpdate(session.userId, updateData, {
      new: true,
    }).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { password, ...safeUser } = user;

    return NextResponse.json({ user: safeUser });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Update user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
