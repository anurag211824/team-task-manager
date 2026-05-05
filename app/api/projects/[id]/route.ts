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
import { validateProjectRequest } from "@/lib/validations";
import { checkProjectAccess, canDeleteProject } from "@/lib/permissions";
import { logActivity } from "@/lib/audit";
import { ActivityAction, ActivityEntityType } from "@prisma/client";
import { UpdateProjectRequest } from "@/types";

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
    const hasAccess = await checkProjectAccess(user.userId, id);
    if (!hasAccess) {
      return forbidden();
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true, avatar: true } },
        members: {
          include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
        },
        _count: { select: { tasks: true, comments: true,  members: true,  } },
        tasks: {
          where: { status: "DONE" },
          select: { id: true }
        }
      },
    });

    if (!project) {
      return notFound();
    }

    return success(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return serverError("Failed to fetch project");
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
    const hasAccess = await checkProjectAccess(user.userId, id);
    if (!hasAccess) {
      return forbidden();
    }

    const body = (await request.json()) as UpdateProjectRequest;

    // Validation
    const validation = validateProjectRequest(body);
    if (!validation.valid) {
      return badRequest(validation.errors.join(", "));
    }

    // Get current project
    const currentProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!currentProject) {
      return notFound();
    }

    // Update project
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        color: body.color,
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        _count: { select: { members: true, tasks: true } },
      },
    });

    // Log activity
    const changes = {
      name: { from: currentProject.name, to: body.name },
      description: { from: currentProject.description, to: body.description },
    };

    await logActivity(
      id,
      user.userId,
      ActivityAction.UPDATED,
      ActivityEntityType.TASK,
      id,
      `Project "${currentProject.name}" updated`,
      undefined,
      changes
    );

    return success(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    return serverError("Failed to update project");
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

    // Check if user can delete
    const canDelete = await canDeleteProject(user.userId, id);
    if (!canDelete) {
      return forbidden();
    }

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return notFound();
    }

    // Delete project (cascades to tasks, members, etc.)
    await prisma.project.delete({
      where: { id },
    });

    // Log activity
    await logActivity(
      id,
      user.userId,
      ActivityAction.DELETED,
      ActivityEntityType.TASK,
      id,
      `Project "${project.name}" deleted`
    );

    return success(null, "Project deleted successfully");
  } catch (error) {
    console.error("Error deleting project:", error);
    return serverError("Failed to delete project");
  }
}
