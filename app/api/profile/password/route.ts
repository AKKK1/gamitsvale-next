import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models";
import { getUserFromRequest } from "@/lib/auth";

export async function PATCH(request: Request) {
  await connectDB();

  const decoded = getUserFromRequest(request);
  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { currentPassword = "", newPassword = "" } = await request.json();
  const nextPassword = String(newPassword);

  if (nextPassword.length < 6) {
    return NextResponse.json(
      { error: "პაროლი მინიმუმ 6 სიმბოლო უნდა იყოს" },
      { status: 400 },
    );
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.password) {
    const hasCurrentPassword = String(currentPassword).length > 0;
    const isMatch =
      hasCurrentPassword &&
      (await bcrypt.compare(String(currentPassword), user.password));

    if (!isMatch) {
      return NextResponse.json(
        { error: "ძველი პაროლი არასწორია" },
        { status: 400 },
      );
    }
  }

  user.password = await bcrypt.hash(nextPassword, 10);
  user.isVerified = true;
  await user.save();

  return NextResponse.json({ success: true });
}
