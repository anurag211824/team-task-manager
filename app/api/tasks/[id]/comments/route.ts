import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  authenticate,
  success,
  badRequest,
  serverError,
  unauthorized,
  forbidden,
  notFound,
} from "@/lib/auth-middleware";
import { checkTaskAccess } from "@/lib/permissions";
import { logActivity, notifyUser } from "@/lib/audit";
import { ActivityAction, ActivityEntityType, NotificationType } from "@prisma/client";
import { CreateCommentRequest } from "@/types";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticate(request);
    if (!user) {
      return unauthorized();
    }

    const { id: taskId } = await params;

    // Check task access
    const hasAccess = await checkTaskAccess(user.userId, taskId);
    if (!hasAccess) {
      return forbidden();
    }

    const body = (await request.json()) as CreateCommentRequest;

    if (!body.content || body.content.trim().length === 0) {
      return badRequest("Comment content is required");
    }

    if (body.content.length > 2000) {
      return badRequest("Comment must not exceed 2000 characters");
    }

    // Get task
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return notFound();
    }

    // Create comment
    const comment = await prisma.taskComment.create({
      data: {
        content: body.content,
        taskId,
        projectId: task.projectId,
        authorId: user.userId,
        parentCommentId: body.parentCommentId,
      },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
      },
    });

    // Update comment count
    await prisma.task.update({
      where: { id: taskId },
      data: { commentsCount: { increment: 1 } },
    });

    // Log activity
    await logActivity(
      task.projectId,
      user.userId,
      ActivityAction.CREATED,
      ActivityEntityType.COMMENT,
      comment.id,
      `Comment added to task "${task.title}"`,
      taskId
    );

    // Notify task creator and assignee
    if (task.creatorId !== user.userId) {
      await notifyUser(
        task.creatorId,
        NotificationType.COMMENT_ADDED,
        "New Comment on Task",
        `New comment on task "${task.title}"`,
        task.projectId,
        taskId
      );
    }

    if (task.assignedToId && task.assignedToId !== user.userId) {
      await notifyUser(
        task.assignedToId,
        NotificationType.COMMENT_ADDED,
        "New Comment on Task",
        `New comment on task "${task.title}"`,
        task.projectId,
        taskId
      );
    }

    return success(comment, "Comment created successfully", 201);
  } catch (error) {
    console.error("Error creating comment:", error);
    return serverError("Failed to create comment");
  }
}
