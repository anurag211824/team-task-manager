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
import { validateTaskRequest } from "@/lib/validations";
import { checkProjectAccess, canManageTasks } from "@/lib/permissions";
import { logActivity, notifyUser } from "@/lib/audit";
import { ActivityAction, ActivityEntityType, NotificationType, TaskStatus } from "@prisma/client";
import { CreateTaskRequest } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const user = await authenticate(request);
    if (!user) {
      return unauthorized();
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const status = searchParams.get("status");
    const assignedToId = searchParams.get("assignedToId");
    const priority = searchParams.get("priority");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    if (!projectId) {
      return badRequest("Project ID is required");
    }

    // Check project access
    const hasAccess = await checkProjectAccess(user.userId, projectId);
    if (!hasAccess) {
      return forbidden();
    }

    const where: any = { projectId };

    if (status) where.status = status;
    if (assignedToId) where.assignedToId = assignedToId;
    if (priority) where.priority = priority;

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        include: {
          creator: { select: { id: true, name: true, email: true, avatar: true } },
          assignedTo: { select: { id: true, name: true, email: true, avatar: true } },
          tags: true,
          _count: { select: { comments: true, subtasks: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.task.count({ where }),
    ]);

    return success({
      data: tasks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return serverError("Failed to fetch tasks");
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request);
    if (!user) {
      return unauthorized();
    }

    const body = (await request.json()) as CreateTaskRequest & { projectId: string };
    const { projectId, ...taskData } = body;

    // Validation
    const validation = validateTaskRequest(taskData, projectId);
    if (!validation.valid) {
      return badRequest(validation.errors.join(", "));
    }

    // Check project access and permissions
    const hasAccess = await checkProjectAccess(user.userId, projectId);
    if (!hasAccess) {
      return forbidden();
    }

    const canCreate = await canManageTasks(user.userId, projectId);
    if (!canCreate) {
      return forbidden();
    }

    // Create task
    const task = await prisma.task.create({
      data: {
        title: taskData.title,
        description: taskData.description,
        status: taskData.status || TaskStatus.TODO,
        priority: taskData.priority,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
        startDate: taskData.startDate ? new Date(taskData.startDate) : null,
        projectId,
        creatorId: user.userId,
        assignedToId: taskData.assignedToId,
        estimatedHours: taskData.estimatedHours,
        parentTaskId: taskData.parentTaskId,
      },
      include: {
        creator: { select: { id: true, name: true, email: true, avatar: true } },
        assignedTo: { select: { id: true, name: true, email: true, avatar: true } },
        tags: true,
      },
    });

    // Connect tags if provided
    if (taskData.tagIds && taskData.tagIds.length > 0) {
      await prisma.task.update({
        where: { id: task.id },
        data: {
          tags: {
            connect: taskData.tagIds.map((tagId) => ({ id: tagId })),
          },
        },
      });
    }

    // Log activity
    await logActivity(
      projectId,
      user.userId,
      ActivityAction.CREATED,
      ActivityEntityType.TASK,
      task.id,
      `Task "${task.title}" created`,
      task.id
    );

    // Notify assigned user
    if (taskData.assignedToId) {
      await notifyUser(
        taskData.assignedToId,
        NotificationType.TASK_ASSIGNED,
        "Task Assigned",
        `You have been assigned a new task: ${task.title}`,
        projectId,
        task.id
      );
    }

    return success(task, "Task created successfully", 201);
  } catch (error) {
    console.error("Error creating task:", error);
    return serverError("Failed to create task");
  }
}
