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
import { checkTaskAccess, canManageTasks } from "@/lib/permissions";
import { logActivity, notifyUser } from "@/lib/audit";
import { ActivityAction, ActivityEntityType, NotificationType } from "@prisma/client";
import { UpdateTaskRequest } from "@/types";

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

    // Check access
    const hasAccess = await checkTaskAccess(user.userId, id);
    if (!hasAccess) {
      return forbidden();
    }

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: { select: { id: true, name: true } },
        creator: { select: { id: true, name: true, email: true, avatar: true } },
        assignedTo: { select: { id: true, name: true, email: true, avatar: true } },
        tags: true,
        comments: {
          include: { author: { select: { id: true, name: true, avatar: true } } },
          orderBy: { createdAt: "desc" },
        },
        attachments: true,
        _count: { select: { subtasks: true } },
      },
    });

    if (!task) {
      return notFound();
    }

    return success(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    return serverError("Failed to fetch task");
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

    // Check access
    const hasAccess = await checkTaskAccess(user.userId, id);
    if (!hasAccess) {
      return forbidden();
    }

    const body = (await request.json()) as UpdateTaskRequest;

    const currentTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!currentTask) {
      return notFound();
    }

    // Check if user can manage tasks in this project
    const canManage = await canManageTasks(user.userId, currentTask.projectId);
    if (!canManage && currentTask.assignedToId !== user.userId) {
      return forbidden();
    }

    // Update task
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: body.title || currentTask.title,
        description: body.description ?? currentTask.description,
        status: body.status || currentTask.status,
        priority: body.priority || currentTask.priority,
        dueDate: body.dueDate ? new Date(body.dueDate) : currentTask.dueDate,
        startDate: body.startDate ? new Date(body.startDate) : currentTask.startDate,
        assignedToId: body.assignedToId ?? currentTask.assignedToId,
        estimatedHours: body.estimatedHours ?? currentTask.estimatedHours,
        progress: body.progress ?? currentTask.progress,
      },
      include: {
        creator: { select: { id: true, name: true, email: true, avatar: true } },
        assignedTo: { select: { id: true, name: true, email: true, avatar: true } },
        tags: true,
      },
    });

    // Log activity
    const changes: any = {};
    if (body.status && body.status !== currentTask.status) {
      changes.status = { from: currentTask.status, to: body.status };
    }
    if (body.assignedToId && body.assignedToId !== currentTask.assignedToId) {
      changes.assignedToId = {
        from: currentTask.assignedToId,
        to: body.assignedToId,
      };
    }

    await logActivity(
      currentTask.projectId,
      user.userId,
      ActivityAction.UPDATED,
      ActivityEntityType.TASK,
      id,
      `Task "${currentTask.title}" updated`,
      id,
      changes
    );

    // Notify assignee if changed
    if (body.assignedToId && body.assignedToId !== currentTask.assignedToId) {
      await notifyUser(
        body.assignedToId,
        NotificationType.TASK_ASSIGNED,
        "Task Assigned",
        `You have been assigned task: ${updatedTask.title}`,
        currentTask.projectId,
        id
      );
    }

    // Notify if status changed to DONE
    if (body.status === "DONE" && currentTask.status !== "DONE") {
      await notifyUser(
        currentTask.creatorId,
        NotificationType.TASK_COMPLETED,
        "Task Completed",
        `Task "${currentTask.title}" has been completed`,
        currentTask.projectId,
        id
      );
    }

    return success(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    return serverError("Failed to update task");
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticate(request);
    if (!user) {
      return unauthorized();
    }

    const { id } = await params;

    // Check access
    const hasAccess = await checkTaskAccess(user.userId, id);
    if (!hasAccess) {
      return forbidden();
    }

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return notFound();
    }

    // Only creator or project admin can delete
    const canDelete =
      task.creatorId === user.userId ||
      (await canManageTasks(user.userId, task.projectId));

    if (!canDelete) {
      return forbidden();
    }

    // Delete task
    await prisma.task.delete({
      where: { id },
    });

    // Log activity
    await logActivity(
      task.projectId,
      user.userId,
      ActivityAction.DELETED,
      ActivityEntityType.TASK,
      id,
      `Task "${task.title}" deleted`,
      id
    );

    return success(null, "Task deleted successfully");
  } catch (error) {
    console.error("Error deleting task:", error);
    return serverError("Failed to delete task");
  }
}
