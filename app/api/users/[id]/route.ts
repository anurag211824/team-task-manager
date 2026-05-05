import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  authenticate,
  success,
  serverError,
  unauthorized,
  notFound,
} from "@/lib/auth-middleware";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticate(request);
    if (!user) {
      return unauthorized();
    }

    const { id } = await params;

    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        timezone: true,
        globalRole: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    if (!targetUser) {
      return notFound();
    }

    return success(targetUser);
  } catch (error) {
    console.error("Error fetching user:", error);
    return serverError("Failed to fetch user");
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticate(request);
    if (!user) {
      return unauthorized();
    }

    const { id } = await params;

    // Users can only update their own profile
    if (user.userId !== id) {
      return unauthorized();
    }

    const body = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: body.name,
        avatar: body.avatar,
        bio: body.bio,
        timezone: body.timezone,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        timezone: true,
        globalRole: true,
      },
    });

    return success(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return serverError("Failed to update user");
  }
}
