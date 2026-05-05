import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { authenticate, success, badRequest, serverError, unauthorized } from "@/lib/auth-middleware";
import { validateProjectRequest } from "@/lib/validations";
import { logActivity } from "@/lib/audit";
import { ActivityAction, ActivityEntityType } from "@prisma/client";
import { CreateProjectRequest } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const user = await authenticate(request);
    if (!user) {
      return unauthorized();
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Get projects where user is owner or member
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where: {
          OR: [
            { ownerId: user.userId },
            { members: { some: { userId: user.userId } } },
          ],
        },
        include: {
          owner: { select: { id: true, name: true, email: true } },
          _count: { select: { members: true, tasks: true } },
          tasks: {
            where: { status: "DONE" },
            select: { id: true }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.project.count({
        where: {
          OR: [
            { ownerId: user.userId },
            { members: { some: { userId: user.userId } } },
          ],
        },
      }),
    ]);

    return success({
      data: projects,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return serverError("Failed to fetch projects");
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request);
    if (!user) {
      return unauthorized();
    }

    const body = (await request.json()) as CreateProjectRequest;

    // Validation
    if (!body.name || body.name.trim().length < 2) {
      return badRequest("Project name must be at least 2 characters long");
    }
    
    const validation = validateProjectRequest(body);
    if (!validation.valid) {
      return badRequest(validation.errors.join(", "));
    }

    // Verify user exists
    const userExists = await prisma.user.findUnique({
      where: { id: user.userId },
    });
    if (!userExists) {
      return unauthorized();
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        name: body.name,
        description: body.description,
        color: body.color || "#3b82f6",
        ownerId: user.userId,
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        _count: { select: { members: true, tasks: true } },
      },
    });

    // Log activity
    await logActivity(
      project.id,
      user.userId,
      ActivityAction.CREATED,
      ActivityEntityType.TASK,
      project.id,
      `Project "${project.name}" created`
    );

    return success(project, "Project created successfully", 201);
  } catch (error) {
    console.error("Error creating project:", error);
    return serverError("Failed to create project");
  }
}
