import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  authenticate,
  success,
  serverError,
  unauthorized,
  forbidden,
  notFound,
} from "@/lib/auth-middleware";
import { canManageMembers } from "@/lib/permissions";
import { logActivity } from "@/lib/audit";
import { ActivityAction, ActivityEntityType } from "@prisma/client";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const user = await authenticate(request);
    if (!user) {
      return unauthorized();
    }

    const { id: projectId, memberId } = await params;

    // Check if user can manage members
    const canManage = await canManageMembers(user.userId, projectId);
    if (!canManage) {
      return forbidden();
    }

    const member = await prisma.projectMember.findUnique({
      where: { id: memberId },
      include: { user: true },
    });

    if (!member || member.projectId !== projectId) {
      return notFound();
    }

    // Remove member
    await prisma.projectMember.delete({
      where: { id: memberId },
    });

    // Log activity
    await logActivity(
      projectId,
      user.userId,
      ActivityAction.DELETED,
      ActivityEntityType.TASK,
      memberId,
      `${member.user.name} removed from project`
    );

    return success(null, "Member removed successfully");
  } catch (error) {
    console.error("Error removing project member:", error);
    return serverError("Failed to remove project member");
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const user = await authenticate(request);
    if (!user) {
      return unauthorized();
    }

    const { id: projectId, memberId } = await params;

    // Check if user can manage members
    const canManage = await canManageMembers(user.userId, projectId);
    if (!canManage) {
      return forbidden();
    }

    const body = await request.json();

    const member = await prisma.projectMember.findUnique({
      where: { id: memberId },
    });

    if (!member || member.projectId !== projectId) {
      return notFound();
    }

    // Update member role/permissions
    const updatedMember = await prisma.projectMember.update({
      where: { id: memberId },
      data: {
        role: body.role || member.role,
        canManageTasks: body.canManageTasks ?? member.canManageTasks,
        canManageMembers: body.canManageMembers ?? member.canManageMembers,
        canDelete: body.canDelete ?? member.canDelete,
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    // Log activity
    await logActivity(
      projectId,
      user.userId,
      ActivityAction.UPDATED,
      ActivityEntityType.TASK,
      memberId,
      `${updatedMember.user.name} role updated to ${body.role || member.role}`,
      undefined,
      { role: { from: member.role, to: body.role || member.role } }
    );

    return success(updatedMember);
  } catch (error) {
    console.error("Error updating project member:", error);
    return serverError("Failed to update project member");
  }
}
