import { prisma } from "./db";
import { ActivityAction, ActivityEntityType, NotificationType } from "@prisma/client";

export async function logActivity(
  projectId: string,
  userId: string,
  action: ActivityAction,
  entityType: ActivityEntityType,
  entityId: string,
  description: string,
  taskId?: string,
  changes?: Record<string, unknown> | null
) {
  try {
    const activityData: Record<string, unknown> = {
      projectId,
      userId,
      action,
      entityType,
      entityId,
      description,
      taskId,
    };

    if (changes !== undefined) {
      activityData.changes = changes;
    }

    await prisma.activity.create({
      data: activityData as Parameters<typeof prisma.activity.create>[0]["data"],
    });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
}

export async function notifyUser(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  projectId?: string,
  taskId?: string,
  metadata?: Record<string, unknown> | null
) {
  try {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // Expire after 30 days

    const notificationData: Record<string, unknown> = {
      userId,
      type,
      title,
      message,
      projectId,
      taskId,
      expiresAt,
    };

    if (metadata !== undefined && metadata !== null) {
      notificationData.metadata = metadata;
    }

    await prisma.notification.create({
      data: notificationData as Parameters<typeof prisma.notification.create>[0]["data"],
    });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
}
