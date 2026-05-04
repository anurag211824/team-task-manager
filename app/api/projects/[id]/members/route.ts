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
import { canManageMembers, checkProjectAccess } from "@/lib/permissions";
import { logActivity, notifyUser } from "@/lib/audit";
import { ActivityAction, ActivityEntityType, NotificationType, ProjectRole } from "@prisma/client";
import { AddProjectMemberRequest } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticate(request);
    if (!user) {
      return unauthorized();
    }

    const { id } = params;

    // Check access
    const hasAccess = await checkProjectAccess(user.userId, id);
    if (!hasAccess) {
      return forbidden();
    }

    const members = await prisma.projectMember.findMany({
      where: { projectId: id },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
      },
      orderBy: { joinedAt: "desc" },
    });

    return success(members);
  } catch (error) {
    console.error("Error fetching project members:", error);
    return serverError("Failed to fetch project members");
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticate(request);
    if (!user) {
      return unauthorized();
    }

    const { id } = params;

    // Check if user can manage members
    const canManage = await canManageMembers(user.userId, id);
    if (!canManage) {
      return forbidden();
    }

    const body = (await request.json()) as AddProjectMemberRequest;

    if (!body.userId) {
      return badRequest("User ID is required");
    }

    // Check if user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: body.userId },
    });

    if (!targetUser) {
      return notFound();
    }

    // Check if already a member
    const existingMember = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: id, userId: body.userId } },
    });

    if (existingMember) {
      return badRequest("User is already a member of this project");
    }

    // Add member
    const member = await prisma.projectMember.create({
      data: {
        projectId: id,
        userId: body.userId,
        role: body.role || ProjectRole.MEMBER,
        canManageTasks: body.canManageTasks ?? true,
        canManageMembers: body.canManageMembers ?? false,
        canDelete: body.canDelete ?? false,
        invitedBy: user.userId,
      },
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
      },
    });

    // Log activity
    await logActivity(
      id,
      user.userId,
      ActivityAction.CREATED,
      ActivityEntityType.TASK,
      member.id,
      `${targetUser.name} added to project`
    );

    // Notify user
    await notifyUser(
      body.userId,
      NotificationType.MEMBER_ADDED,
      "Added to Project",
      `You have been added to project as ${body.role || ProjectRole.MEMBER}`,
      id
    );

    return success(member, "Member added successfully", 201);
  } catch (error) {
    console.error("Error adding project member:", error);
    return serverError("Failed to add project member");
  }
}
