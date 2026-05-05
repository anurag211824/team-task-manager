import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  authenticate,
  success,
  unauthorized,
  serverError,
} from "@/lib/auth-middleware";

export async function GET(request: NextRequest) {
  try {
    const user = await authenticate(request);
    if (!user) {
      return unauthorized();
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId: user.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // Limit to recent 50
    });

    return success(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return serverError("Failed to fetch notifications");
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await authenticate(request);
    if (!user) {
      return unauthorized();
    }

    const { ids, all } = await request.json();

    if (all) {
      await prisma.notification.updateMany({
        where: { userId: user.userId },
        data: { isRead: true },
      });
    } else if (Array.isArray(ids)) {
      await prisma.notification.updateMany({
        where: {
          id: { in: ids },
          userId: user.userId,
        },
        data: { isRead: true },
      });
    }

    return success(null, "Notifications marked as read");
  } catch (error) {
    console.error("Error updating notifications:", error);
    return serverError("Failed to update notifications");
  }
}
